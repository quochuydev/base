const COLORS = [
    { hex: '#f47983', name: 'f47983' },
    { hex: '#f00056', name: 'f00056' },
    { hex: '#db5a6b', name: 'db5a6b' },
    { hex: '#f20c00', name: 'f20c00' },
    { hex: '#c93756', name: 'c93756' },
    { hex: '#9d2933', name: '9d2933' },
    { hex: '#ef7a82', name: 'ef7a82' },
    { hex: '#8c4356', name: '8c4356' },
    { hex: '#f9906f', name: 'f9906f' },
    { hex: '#faff72', name: 'faff72' },
    { hex: '#ff8c31', name: 'ff8c31' },
    { hex: '#ff8936', name: 'ff8936' },
    { hex: '#ffc773', name: 'ffc773' },
    { hex: '#bddd22', name: 'bddd22' },
    { hex: '#afdd22', name: 'afdd22' },
    { hex: '#789262', name: '789262' },
    { hex: '#0aa344', name: '0aa344' },
    { hex: '#1bd1a5', name: '1bd1a5' },
    { hex: '#44cef6', name: '44cef6' },
    { hex: '#177cb0', name: '177cb0' },
    { hex: '#065279', name: '065279' },
    { hex: '#3eede7', name: '3eede7' },
    { hex: '#70f3ff', name: '70f3ff' },
    { hex: '#4b5cc4', name: '4b5cc4' },
    { hex: '#2e4e7e', name: '2e4e7e' },
    { hex: '#bbcdc5', name: 'bbcdc5' },
    { hex: '#3b2e7e', name: '3b2e7e' },
    { hex: '#426666', name: '426666' },
    { hex: '#574266', name: '574266' },
    { hex: '#8d4bbb', name: '8d4bbb' },
    { hex: '#815463', name: '815463' },
    { hex: '#815476', name: '815476' },
    { hex: '#4c221b', name: '4c221b' },
    { hex: '#003371', name: '003371' },
    { hex: '#56004f', name: '56004f' },
    { hex: '#801dae', name: '801dae' },
    { hex: '#4c8dae', name: '4c8dae' },
    { hex: '#b0a4e3', name: 'b0a4e3' },
    { hex: '#cca4e3', name: 'cca4e3' },
    { hex: '#edd1d8', name: 'edd1d8' },
    { hex: '#e4c6d0', name: 'e4c6d0' },
    { hex: '#758a99', name: '758a99' },
    { hex: '#312520', name: '312520' },
    { hex: '#75664d', name: '75664d' },
    { hex: '#665757', name: '665757' },
    { hex: '#41555d', name: '41555d' },
];

class GHAT {
    w: number;
    h: number;
    PARTITIONS: number;
    BASE_SEED: number;
    SEED_H: number;
    draw?: CanvasRenderingContext2D | null;
    fillStyle?: string;
    SEED_W: number;

    constructor(w = 72) {
        this.w = w;
        this.h = w; //h;

        this.PARTITIONS = 9;
        this.BASE_SEED = 9;
        this.SEED_H = this.h / this.BASE_SEED;
        this.SEED_W = this.w / this.BASE_SEED;
    }

    getImage(md5Str: string) {
        if (typeof document === 'undefined') {
            return null;
        }
        const element: HTMLCanvasElement = document.createElement('canvas');
        if (!element.getContext) {
            throw new Error('Canvas does not supported');
        }
        element.width = this.w;
        element.height = this.h;
        this.draw = element.getContext('2d');
        if (this.draw) {
            const { grid, color } = this.md5CovertToGridAndColor(md5Str);
            this.draw.fillStyle = this.fillStyle || color;
            this.map(this.grid(grid));
            return element.toDataURL('image/png');
        }
        return null;
    }

    md5CovertToGridAndColor(md5Str: string) {
        const arr = new Array(this.PARTITIONS * this.BASE_SEED).fill(false);
        const cArr: number[] = [0, 0, 0];
        for (let i = 0; i < md5Str.length; i++) {
            arr[i % (this.PARTITIONS * this.BASE_SEED)] = md5Str.charCodeAt(i) % 2 === 0;
            cArr[i % 3] += md5Str.charCodeAt(i);
        }
        return {
            grid: arr,
            color: COLORS[(cArr[0] + cArr[1] + cArr[2]) % COLORS.length].hex,
        };
    }

    drawImage(...args: any[]) {
        if (this.draw) {
            this.draw.fillRect(args[0], args[1], args[2], args[3]);
        }
    }

    map(grid: any[] | boolean[][]) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === true) {
                    this.drawImage(this.SEED_H * y, this.SEED_W * x, this.SEED_W, this.SEED_H);
                    if (y < this.PARTITIONS - 1) {
                        this.drawImage(
                            this.SEED_H * (this.PARTITIONS + 1 - y),
                            this.SEED_W * x,
                            this.SEED_W,
                            this.SEED_H
                        );
                    }
                }
            }
        }
    }

    grid(md5Grid: boolean[]) {
        const map: any[] = [];
        for (let y = 0; y < this.PARTITIONS; y++) {
            map[y] = [];
            for (let x = 0; x < this.BASE_SEED; x++) {
                map[y][x] = md5Grid[x * y + x];
            }
        }
        return map;
    }
}

export default GHAT;
