export class TableBuilder{

    private columnSizes: number[] = [];
    private rows: Row[] = [];

    public addHeader(header: string, padding: Padding = Padding.LINE): TableBuilder{
        const formattedHeader: string = header ? Padding.EMPTY + header + Padding.EMPTY : "";
        this.rows.push({items: [formattedHeader], type: RowType.HEADER, padding });
        return this;
    }

    public addData(data: string[], padding: Padding = Padding.EMPTY): TableBuilder{
        const formattedData: string[] = data.map(dataValue =>
            dataValue ? Padding.EMPTY + dataValue + Padding.EMPTY : ""
        );
        this.updateColumnSizes(formattedData);
        this.rows.push({items: formattedData, type: RowType.DATA, padding });
        return this;
    }

    public addSeparator(padding: Padding = Padding.LINE): TableBuilder{
        this.rows.push({items: [], type: RowType.SEPARATOR, padding });
        return this;
    }

    public build(): string{
        const renderedRows: string[] = [];
        for(let i=0; i < this.rows.length; i++){
            const edges: Edges = this.getEdgesForCurrent(this.rows[i], this.rows[i-1], this.rows[i+1]);
            const renderedRow: string = this.renderRow(this.rows[i], edges);
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

    private getEdgesForCurrent(current: Row, previous?: Row, next?: Row): Edges{
        const middle: string = this.getMiddleEdge(current, previous, next);
        if(!previous)
            return { left: "╔", middle, right: "╗" };
        else if(!next)
            return { left: "╚", middle, right: "╝" };
        else if(current.padding == Padding.LINE)
            return { left: "╠", middle, right: "╣" };
        else
            return { left: "║", middle, right: "║" };
    }

    private getMiddleEdge(current: Row, previous?: Row, next?: Row): string{
        const previousEdge: boolean = this.doesRowHaveLinePadding(previous);
        const currentEdge: boolean = this.doesRowHaveLinePadding(current, true);
        const nextEdge: boolean = this.doesRowHaveLinePadding(next);
        
        if(current.padding == Padding.EMPTY && current.type != RowType.DATA)
            return Padding.EMPTY;
        else if(previousEdge && currentEdge && nextEdge)
            return "╬";
        else if(!previousEdge && currentEdge && nextEdge)
            return "╦";
        else if(previousEdge && currentEdge && !nextEdge)
            return "╩";
        else if(previousEdge && !currentEdge && nextEdge)
            return "║";
        else if(!previousEdge && currentEdge && !nextEdge)
            return Padding.LINE;
        else
            return Padding.EMPTY;
    }

    private doesRowHaveLinePadding(row?: Row, isCurrent?: boolean): boolean{
        if(!row)
            return false;
        else if(row.type == RowType.DATA && !isCurrent)
            return true;
        else
            return row.padding == Padding.LINE;
    }

    private renderRow(row: Row, edges: Edges): string{
        if(row.type == RowType.HEADER)
            return this.renderSingleCellRow(row, edges);
        else
            return this.renderMultiCellRow(row, edges);
    }

    private renderSingleCellRow(row: Row, edges: Edges): string {
        const intermediaryRow: Row = { items: [], type: row.type, padding: row.padding};
        const renderedRow: string = this.renderMultiCellRow(intermediaryRow, edges);
        const dataStart: number = Math.floor(renderedRow.length/2) - Math.floor(row.items[0].length/2);
        const dataEnd: number = Math.floor(renderedRow.length/2) + Math.ceil(row.items[0].length/2);
        return renderedRow.substring(0, dataStart) + row.items[0] + renderedRow.substring(dataEnd);
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