export class TableBuilder{

    private columnSizes: number[] = [];
    private rows: Row[] = [];

    public addHeader(titles: string[]): TableBuilder{
        const formattedTitles: string[] = titles.map(title => Padding.EMPTY + title + Padding.EMPTY);
        this.addRow(formattedTitles, RowType.HEADER, Padding.LINE);
        return this;
    }

    public addData(data: string[]): TableBuilder{
        this.addRow(data, RowType.DATA, Padding.EMPTY);
        return this;
    }

    public addEmptySeparator(): TableBuilder{
        this.addRow([], RowType.EMPTY, Padding.EMPTY);
        return this;
    }

    public addLineSeparator(): TableBuilder{
        this.addRow([], RowType.LINE, Padding.LINE);
        return this;
    }

    public build(): string{
        const renderedRows: string[] = [];
        for(const row of this.rows){
            const edges: Edges = this.getEdges(row);
            const renderedRow: string = this.renderRow(row, edges);
            renderedRows.push(renderedRow);
        }
        return renderedRows.join("\n");
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
                switch(row.type){
                    case RowType.HEADER:
                    case RowType.LINE:
                        return { left: "╠", middle: "╬", right: "╣" };
                    default:
                        return { left: "║", middle: "║", right: "║" };
                }
        }
    }

    private renderRow(row: Row, edges: Edges): string{
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
    LINE,
    EMPTY
}

enum Padding{
    EMPTY = " ",
    LINE = "═"
}