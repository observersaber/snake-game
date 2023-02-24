import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Direction, Food, Game, Snake } from './game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'snake-game';
  game: Game;
  private requestId!: number;

  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    this.game = this.initializeGame();
  }

  ngAfterViewInit(): void {
    this.drawGame();
    this.startGameLoop();
  }

  ngOnDestroy(): void {
    this.stopGameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        this.game.snake.direction = Direction.Up;
        break;
      case 'ArrowDown':
        this.game.snake.direction = Direction.Down;
        break;
      case 'ArrowLeft':
        this.game.snake.direction = Direction.Left;
        break;
      case 'ArrowRight':
        this.game.snake.direction = Direction.Right;
        break;
    }
  }

  drawGame(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const gridSize = this.game.gridSize;
    const blockSize = canvas.width / gridSize;
    if (!ctx) {return}
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(this.game.food.x * blockSize, this.game.food.y * blockSize, blockSize, blockSize);

    // Draw snake
    ctx.fillStyle = 'green';
    for (let i = 0; i < this.game.snake.body.length; i++) {
      const point = this.game.snake.body[i];
      ctx.fillRect(point.x * blockSize, point.y * blockSize, blockSize, blockSize);
    }
  }

  initializeGame(): Game {
    const gridSize = 20;
    const snake = new Snake(gridSize / 2, gridSize / 2);
    const food = new Food(snake, gridSize);

    return new Game(gridSize, snake, food);
  }

  startGameLoop(): void {
    const loop = () => {
      this.game.update();
      this.drawGame();
      this.requestId = window.requestAnimationFrame(loop);
    };

    loop();
  }

  stopGameLoop(): void {
    window.cancelAnimationFrame(this.requestId);
  }
  
}