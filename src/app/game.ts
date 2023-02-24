export enum Direction {
    Up,
    Down,
    Left,
    Right,
}

export class Point {
    constructor(public x: number, public y: number) { }
}

export class Snake {
    direction: Direction = Direction.Up;
    body: Point[] = [];




    constructor(startX: number, startY: number) {
        this.body.push(new Point(startX, startY));
        this.body.push(new Point(startX, startY + 1));
        this.body.push(new Point(startX, startY + 2));
    }

    update(): void {
        // Move body
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // Move head
        const head = this.body[0];
        switch (this.direction) {
            case Direction.Up:
                head.y -= 1;
                break;
            case Direction.Down:
                head.y += 1;
                break;
            case Direction.Left:
                head.x -= 1;
                break;
            case Direction.Right:
                head.x += 1;
                break;
        }
    }

    eat(food: Food): void {
        // Add new segment to body
        const lastSegment = this.body[this.body.length - 1];
        const newSegment = new Point(lastSegment.x, lastSegment.y);
        this.body.push(newSegment);

        // Generate new food position
        food.generateNewPosition();
    }

    collidesWith(point: Point): boolean {
        // Check if the point is inside the snake's body
        return this.body.some((p) => p.x === point.x && p.y === point.y);
    }
}

export class Food {
    x!: number;
    y!: number;

    constructor(private snake: Snake, private gridSize: number) {
        this.generateNewPosition();
    }

    generateNewPosition(): void {
        // Generate new position until it is not inside the snake's body
        do {
            this.x = Math.floor(Math.random() * this.gridSize);
            this.y = Math.floor(Math.random() * this.gridSize);
        } while (this.snake.collidesWith(new Point(this.x, this.y)));
    }
}

export class Game {
    private timeSinceLastUpdate = 0;
    private updateInterval = 5;

    constructor(public gridSize: number, public snake: Snake, public food: Food) { }

    update(): void {
        this.timeSinceLastUpdate += 1;

        // Update snake
        if (this.timeSinceLastUpdate >= this.updateInterval) {
            this.snake.update();
            
            // Check if snake collides with food
            if (this.snake.collidesWith(new Point(this.food.x, this.food.y))) {
                this.snake.eat(this.food);
            }

            // Check if snake collides with wall
            const head = this.snake.body[0];
            if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
                this.reset();
            }

            // Check if snake collides with itself
            for (let i = 1; i < this.snake.body.length; i++) {
                const segment = this.snake.body[i];
                if (segment.x === head.x && segment.y === head.y) {
                    this.reset();
                    break;
                }
            }

            this.timeSinceLastUpdate = 0;
        }
    }

    reset(): void {
        this.snake = new Snake(this.gridSize / 2, this.gridSize / 2);
        this.food.generateNewPosition();
    }
}