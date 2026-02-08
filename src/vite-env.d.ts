declare module "jspdf-autotable" {
    import type jsPDF from "jspdf";

    export type RowInput = Array<
        | string
        | number
        | boolean
        | null
        | undefined
        | {
              content: string;
              colSpan?: number;
              styles?: Record<string, unknown>;
          }
    >;

    const autoTable: (doc: jsPDF, options: Record<string, unknown>) => void;
    export default autoTable;
}
