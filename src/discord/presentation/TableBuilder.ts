export class TableBuilder{

    private columnSizes: number[] = [];
    private rows: Row[] = [];

    public addHeader(header: string, padding: Padding = Padding.LINE): TableBuilder{
        const formattedHeader: string = header ? Padding.EMPTY + header + Padding.EMPTY : "";
        this.addRow([formattedHeader], RowType.HEADER, padding);
        return this;
    }

    public addData(data: string[], padding: Padding = Padding.EMPTY): TableBuilder{
        const formattedData: string[] = data.map(dataValue =>
            dataValue ? Padding.EMPTY + dataValue + Padding.EMPTY : ""
        );
        this.addRow(formattedData, RowType.DATA, padding);
        return this;
    }

    public addSeparator(padding: Padding = Padding.LINE): TableBuilder{
        this.addRow([], RowType.SEPARATOR, padding);
        return this;
    }

    public build(): string{
        const renderedRows: string[] = [];
        for(const row of this.rows){
            const edges: Edges = this.getEdges(row);
            const renderedRow: string = this.renderRow(row, edges);
            renderedRows.push(renderedRow);
        }
        return "```\n" + renderedRows.join("\n") + "\n```";
    }

    private updateColumnSizes(items: string[]): void{
        if(items.length > this.columnSizes.length){
            const newColumns: number[] = new Array(items.length - this.columnSizes.length).fill(0);
            this.columnSizes = this.columnSizes.concat(newColumns);
        }

        for(let i=0; i < items.length; i++)
            if(items[i].length > this.columnSizes[i])
                this.columnSizes[i] = items[i].length;
    }

    private addRow(items: string[], type: RowType, padding: Padding): void{
        this.updateColumnSizes(items);
        this.rows.push({ index: this.rows.length, items, type, padding });
    }

    private getEdges(row: Row): Edges{
        switch(row.index){
            case 0:
                return { left: "╔", middle: "╦", right: "╗" };
            case this.rows.length - 1:
                return { left: "╚", middle: "╩", right: "╝" };
            default:
                switch(row.padding){
                    case Padding.LINE:
                        return { left: "╠", middle: "╬", right: "╣" };
                    default:
                        return { left: "║", middle: "║", right: "║" };
                }
        }
    }

    private renderRow(row: Row, edges: Edges): string{
        if(row.type == RowType.HEADER)
            return this.renderSingleCellRow(row, edges);
        else
            return this.renderMultiCellRow(row, edges);
    }

    private renderSingleCellRow(row: Row, edges: Edges): string{
        const size: number = this.columnSizes.reduce((totalSize, cellSize) => totalSize + cellSize);
        return this.renderCell(row.items[0], size, row.padding);
    }

    private renderMultiCellRow(row: Row, edges: Edges): string{
        let cells: string[] = [];
        for(let i=0; i < this.columnSizes.length; i++){
            const item: string = row.items[i] ? row.items[i] : "";
            const cell: string = this.renderCell(item, this.columnSizes[i], row.padding); 
            cells.push(cell);
        }
        const left: string = edges.left + row.padding;
        const middle: string = cells.join(row.padding + edges.middle + row.padding);
        const right: string = row.padding + edges.right;
        return left + middle + right;
    }

    private renderCell(item: string, size: number, padding: Padding): string{
        const remainingSize: number = size - item.length;
        const prefix: string = padding.repeat(Math.floor(remainingSize/2));
        const suffix: string = padding.repeat(Math.ceil(remainingSize/2));
        return prefix + item + suffix;
    }
}

interface Row{
    readonly index: number;
    readonly items: string[];
    readonly type: RowType;
    readonly padding: Padding;
}

interface Edges{
    readonly left: string,
    readonly middle: string,
    readonly right: string
}

enum RowType{
    HEADER,
    DATA,
    SEPARATOR
}

export enum Padding{
    EMPTY = " ",
    LINE = "═"
}