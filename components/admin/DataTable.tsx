import type { ReactNode } from "react";

export function DataTable({
  headers,
  rows,
  emptyLabel,
}: {
  headers: string[];
  rows: ReactNode[][];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="text-xs text-pale-mist">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-ash-border text-left text-fog">
            {headers.map((h) => (
              <th key={h} className="p-2.5 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-ash-border last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="p-2.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
