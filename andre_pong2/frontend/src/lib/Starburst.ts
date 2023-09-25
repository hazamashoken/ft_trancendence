import { Pong } from '@/lib/pong.enum';

export class Starburst
{
  origin_x: number = 0;
  origin_y: number = 0;
  position: number[] = [];
  direction: number[] = [];
  colour: string[] = [];
  time: number[] = [];
  changed: boolean = false;
  speed: number = 0.7;

  public constructor(x: number, y: number, count: number)
  {
    this.origin_x = x;
    this.origin_y = y;
    this.changed = false;
    for (let i: number = 0; i < count; i++)
    {
      let angle = Math.random() * Math.PI * 2;

      this.position.push(this.origin_x);
      this.position.push(this.origin_y);
      this.direction.push(Math.cos(angle) * this.speed);
      this.direction.push(Math.sin(angle) * this.speed);
      this.colour.push(this.randColour());
      this.time.push(this.randTime());
    }
  }

  private randColour()
  : string
  {
    const shade: string[] = ["00", "7f", "ff"];
    let colour: string = "#";

    colour += shade[Math.floor((Math.random() * shade.length))];
    colour += shade[Math.floor((Math.random() * shade.length))];
    colour += shade[Math.floor((Math.random() * shade.length))];
    return colour;
  }

  private randTime()
  : number
  {
    return Math.random() * 1500 + 1000;
  }

  public reset()
  {
    let count: number = this.time.length;

    if (!this.changed)
      return ;
    for (let i: number = 0; i < count; i++)
    {
      let x: number = i * 2;
      let y: number = x + 1;

      this.position[x] = this.origin_x;
      this.position[y] = this.origin_y;
      this.time[i] = this.randTime();
    }
    this.changed = false;
  }

  public update(delta: number)
  {
    let count: number = this.time.length;
    let seconds: number = delta / 1000;

    for (let i: number = 0; i < count; i++)
    {
      let x: number = i * 2;
      let y: number = x + 1;

      this.time[i] -= delta;
      if (this.time[i] < 0)
      {
        let angle = Math.random() * Math.PI * 2;

        this.position[x] = this.origin_x;
        this.position[y] = this.origin_y;
        this.direction[x] = Math.cos(angle) * this.speed;
        this.direction[y] = Math.sin(angle) * this.speed;
        this.colour[i] = this.randColour();
        this.time[i] = this.randTime();
      }
      else
      {
        this.position[x] += seconds * this.speed * this.direction[x];
        this.position[y] += seconds * this.speed * this.direction[y];
      }
    }
    this.changed = true;
  }

  private drawSquare(canvas: HTMLCanvasElement, x: number, y: number, colour: string = "#ffffff")
  {
    var canvas2d = canvas.getContext("2d");
    var square = canvas.height * Pong.SQUARE_SIZE;
    var halfsquare = square / 2;
  
    if (canvas2d != null)
    {
      canvas2d.fillStyle = colour;
      canvas2d.fillRect(Math.round((canvas.width / 2) + (x * canvas.height) - halfsquare),
                        Math.round((y * canvas.height) - halfsquare),
                        Math.round(square), Math.round(square));
    }
  }

  public render(canvas: HTMLCanvasElement)
  {
    let count: number = this.time.length;

    for (let i: number = 0; i < count; i++)
    {
      let x: number = i * 2;
      let y: number = x + 1;
      this.drawSquare(canvas, this.position[x], this.position[y], this.colour[i]);
    }
  }
}
