import { Pong } from '../../../backend/src/pong/pong.enum';

export class Starburst
{
  origin_x: number = 0;
  origin_y: number = 0;
  count: number = 0;
  position: number[] = [];
  direction: number[] = [];
  colour: string[] = [];
  time: number[] = [];
  stopped: boolean = true;
  finished: boolean = true;
  speed: number = 0.7;

  public constructor(x: number, y: number, count: number)
  {
    this.origin_x = x;
    this.origin_y = y;
    this.count = count;
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
    if (!this.stopped)
      return ;
    this.position = [];
    this.direction = [];
    this.colour = [];
    this.time = [];
    for (let i: number = 0; i < this.count; i++)
    {
      let angle = Math.random() * Math.PI * 2;

      this.position.push(this.origin_x);
      this.position.push(this.origin_y);
      this.direction.push(Math.cos(angle) * this.speed);
      this.direction.push(Math.sin(angle) * this.speed);
      this.colour.push(this.randColour());
      this.time.push(this.randTime());
    }
    this.stopped = false;
    this.finished = false;
  }

  public stop()
  {
    this.stopped = true;
  }

  public update(delta: number)
  {
    if (this.finished)
      return;

    let seconds: number = delta / 1000;
    let active: boolean = false;

    for (let i: number = 0; i < this.count; i++)
    {
      let x: number = i * 2;
      let y: number = x + 1;

      this.time[i] -= delta;
      if (this.time[i] < 0)
      {
        if (!this.stopped)
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
          this.time[i] = 0;
        }
      }
      else
      {
        this.position[x] += seconds * this.speed * this.direction[x];
        this.position[y] += seconds * this.speed * this.direction[y];
        active = true;
      }
    }
    if (this.stopped && !active)
      this.finished = true;
  }

  private drawSquare(canvas: HTMLCanvasElement, x: number, y: number, colour: string = "#ffffff")
  {
    let canvas2d = canvas.getContext("2d");
    let square: number = canvas.height * Pong.SQUARE_SIZE;
    let halfsquare: number = square / 2;
  
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
    if (this.finished)
      return;

    for (let i: number = 0; i < this.count; i++)
    {
      if (this.time[i] <= 0)
        continue;

      let x: number = i * 2;
      let y: number = x + 1;

      this.drawSquare(canvas, this.position[x], this.position[y], this.colour[i]);
    }
  }
}
