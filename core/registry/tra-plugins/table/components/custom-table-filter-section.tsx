import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Table } from '@tanstack/react-table';
import Select, { type ISelectOption } from '@/components/select';

const CustomTableFilterSection = <T,>({
  table,
  normalizedFilterColumns,
  data,
  augmentedColumns,
}: {
  table: Table<T>;
  normalizedFilterColumns: {
    id: string;
    label?: string;
    placeholder?: string;
    columns?: string[];
    path?: string | string[];
  }[];
  data: T[];
  augmentedColumns: Array<{ header: string; accessorKey?: string }>;
}) => {
  const isMobile = useIsMobile();

  const filterOptionsCache = useMemo(() => {
    const getNamedValue = (obj: unknown) => {
      if (!obj || typeof obj !== 'object') return '';
      const o = obj as Record<string, unknown>;
      const extracted = o['name'] ?? o['label'] ?? o['title'];
      return extracted ? String(extracted).trim() : '';
    };

    const getNestedValue = (obj: unknown, path: string): unknown =>
      path.split('.').reduce<unknown>((current, key) => {
        if (current && typeof current === 'object') {
          return (current as Record<string, unknown>)[key];
        }
        return undefined;
      }, obj as unknown);

    const cache: Record<string, ISelectOption[]> = {};

    normalizedFilterColumns.forEach((fc) => {
      const uniqueValues = new Set<string>();
      const keysToProcess = fc.columns && fc.columns.length > 0 ? fc.columns : [fc.id];

      // Column tanımını bul (accessorFn için)
      const columnDef = augmentedColumns.find(
        (c) =>
          (c as { accessorKey?: string }).accessorKey === fc.id ||
          (c as { id?: string }).id === fc.id,
      );

      data.forEach((row) => {
        // Eğer column'da accessorFn varsa, onu kullan
        if (
          columnDef &&
          (columnDef as { accessorFn?: (row: T) => unknown }).accessorFn &&
          keysToProcess.length === 1 &&
          !fc.path
        ) {
          try {
            const value = (columnDef as { accessorFn?: (row: T) => unknown }).accessorFn!(row);
            if (value && String(value).trim() && String(value).trim() !== '-') {
              uniqueValues.add(String(value).trim());
            }
          } catch {
            // Hata durumunda devam et
          }
          return;
        }

        // Eğer birden fazla column varsa, değerleri birleştir
        if (keysToProcess.length > 1) {
          const combinedValue = keysToProcess
            .map((key) => {
              const value = (row as Record<string, unknown>)[key];
              if (value === null || value === undefined) return '';

              // Path varsa nested değere eriş
              if (fc.path) {
                const paths = Array.isArray(fc.path) ? fc.path : [fc.path];
                if (Array.isArray(value)) {
                  return value
                    .map((item) => {
                      if (item && typeof item === 'object') {
                        // Her path için değer al ve birleştir
                        return paths
                          .map((p) => {
                            const nested = getNestedValue(item, p);
                            return nested !== null && nested !== undefined
                              ? String(nested).trim()
                              : '';
                          })
                          .filter(Boolean)
                          .join(' ');
                      }
                      return '';
                    })
                    .filter(Boolean)
                    .join(', ');
                }
                if (typeof value === 'object') {
                  // Tek obje için tüm path'leri birleştir
                  return paths
                    .map((p) => {
                      const nested = getNestedValue(value, p);
                      return nested !== null && nested !== undefined ? String(nested).trim() : '';
                    })
                    .filter(Boolean)
                    .join(' ');
                }
              }

              // Path yoksa normal değer
              if (Array.isArray(value)) {
                return value
                  .map((item) => {
                    if (item && typeof item === 'object') {
                      const obj = item as Record<string, unknown>;
                      const nestedVal = obj['name'] ?? obj['label'] ?? obj['title'];
                      return nestedVal !== null && nestedVal !== undefined
                        ? String(nestedVal).trim()
                        : '';
                    }
                    return String(item).trim();
                  })
                  .filter(Boolean)
                  .join(' ');
              }
              if (typeof value === 'object') {
                return getNamedValue(value);
              }
              return String(value).trim();
            })
            .filter(Boolean)
            .join(' ')
            .trim();

          if (combinedValue) {
            uniqueValues.add(combinedValue);
          }
        } else {
          // Tek column için normal işlem
          keysToProcess.forEach((key) => {
            const value = (row as unknown as Record<string, unknown>)[key];

            if (value === null || value === undefined) return;

            // Eğer path verilmişse, nested değerlere eriş
            if (fc.path) {
              const paths = Array.isArray(fc.path) ? fc.path : [fc.path];
              if (Array.isArray(value)) {
                value.forEach((item) => {
                  if (item && typeof item === 'object') {
                    // Her path için değer al ve birleştir
                    const combined = paths
                      .map((p) => {
                        const nestedValue = getNestedValue(item, p);
                        return nestedValue !== null && nestedValue !== undefined
                          ? String(nestedValue).trim()
                          : '';
                      })
                      .filter(Boolean)
                      .join(' ');
                    if (combined) {
                      uniqueValues.add(combined);
                    }
                  }
                });
              } else if (typeof value === 'object') {
                // Tek obje için tüm path'leri birleştir
                const combined = paths
                  .map((p) => {
                    const nestedValue = getNestedValue(value as Record<string, unknown>, p);
                    return nestedValue !== null && nestedValue !== undefined
                      ? String(nestedValue).trim()
                      : '';
                  })
                  .filter(Boolean)
                  .join(' ');
                if (combined) {
                  uniqueValues.add(combined);
                }
              }
            } else {
              // Path yoksa, basit string çevirme
              if (Array.isArray(value)) {
                value.forEach((item) => {
                  if (item && typeof item === 'object') {
                    const extracted = item.name || item.label || item.title;
                    if (extracted) {
                      uniqueValues.add(String(extracted).trim());
                    }
                  } else if (item) {
                    uniqueValues.add(String(item).trim());
                  }
                });
              } else if (typeof value === 'object') {
                const extracted = getNamedValue(value);
                if (extracted) {
                  uniqueValues.add(extracted);
                }
              } else {
                uniqueValues.add(String(value).trim());
              }
            }
          });
        }
      });

      cache[fc.id] = Array.from(uniqueValues)
        .filter((v) => v !== '')
        .sort()
        .map((value) => ({
          content: value,
          value,
        }));
    });

    return cache;
  }, [data, normalizedFilterColumns, augmentedColumns]);

  return (
    <>
      {normalizedFilterColumns?.length > 0 && (
        <div
          className="grid md:items-center gap-4"
          style={{
            gridTemplateColumns: isMobile
              ? 'repeat(2, minmax(0, 1fr))'
              : `repeat(${normalizedFilterColumns?.length ?? 1}, minmax(0, 1fr))`,
          }}
        >
          {normalizedFilterColumns.map((fc) => {
            const col = table.getColumn(fc.id as string);
            if (!col) return null;
            const value = (col.getFilterValue() as string) ?? '';
            const { header } = col.columnDef;
            const headerText = typeof header === 'string' ? header : undefined;
            const options = filterOptionsCache[fc.id] || [];
            return (
              <Select
                key={fc.id}
                value={value}
                onChange={(v) => {
                  if (v) {
                    col.setFilterValue(v);
                  } else {
                    col.setFilterValue('');
                  }
                }}
                options={options}
                placeholder={`${fc.placeholder ?? headerText ?? fc.id} Search...`}
                isSearchable
                size="sm"
                dropdownAlign="left"
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default CustomTableFilterSection;
