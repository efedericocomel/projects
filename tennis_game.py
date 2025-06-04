import pygame
import random
import sys

WIDTH, HEIGHT = 800, 400
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 200, 0)

PADDLE_WIDTH, PADDLE_HEIGHT = 10, 60
BALL_RADIUS = 8
FPS = 60

action_speeds = {
    'easy': 4,
    'medium': 6,
    'hard': 8,
}

class Paddle:
    def __init__(self, x, y):
        self.rect = pygame.Rect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT)

    def move(self, dy):
        self.rect.y += dy
        if self.rect.top < 0:
            self.rect.top = 0
        if self.rect.bottom > HEIGHT:
            self.rect.bottom = HEIGHT

    def ai_move(self, ball_y, speed):
        if self.rect.centery < ball_y:
            self.rect.y += speed
        elif self.rect.centery > ball_y:
            self.rect.y -= speed
        if self.rect.top < 0:
            self.rect.top = 0
        if self.rect.bottom > HEIGHT:
            self.rect.bottom = HEIGHT

    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, self.rect)
        head_center = (self.rect.centerx, self.rect.top - 10)
        pygame.draw.circle(screen, WHITE, head_center, 10)

class Ball:
    def __init__(self):
        self.rect = pygame.Rect(WIDTH//2, HEIGHT//2, BALL_RADIUS*2, BALL_RADIUS*2)
        self.vx = random.choice([-5, -4, 4, 5])
        self.vy = random.choice([-4, -3, 3, 4])

    def reset(self, direction):
        self.rect.center = (WIDTH//2, HEIGHT//2)
        self.vx = direction * random.choice([-5, -4, 4, 5])
        self.vy = random.choice([-4, -3, 3, 4])

    def move(self):
        self.rect.x += self.vx
        self.rect.y += self.vy
        if self.rect.top <= 0 or self.rect.bottom >= HEIGHT:
            self.vy *= -1

    def draw(self, screen):
        pygame.draw.ellipse(screen, WHITE, self.rect)


def main(difficulty='easy'):
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption('Simple Tennis')
    clock = pygame.time.Clock()

    user = Paddle(20, HEIGHT // 2 - PADDLE_HEIGHT // 2)
    computer = Paddle(WIDTH - 30, HEIGHT // 2 - PADDLE_HEIGHT // 2)
    ball = Ball()
    score_user = 0
    score_computer = 0
    ai_speed = action_speeds.get(difficulty, 4)

    font = pygame.font.SysFont(None, 36)

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP]:
            user.move(-6)
        if keys[pygame.K_DOWN]:
            user.move(6)

        computer.ai_move(ball.rect.centery, ai_speed)

        ball.move()
        if ball.rect.colliderect(user.rect):
            ball.vx = abs(ball.vx)
        elif ball.rect.colliderect(computer.rect):
            ball.vx = -abs(ball.vx)

        if ball.rect.left <= 0:
            score_computer += 1
            ball.reset(1)
        elif ball.rect.right >= WIDTH:
            score_user += 1
            ball.reset(-1)

        screen.fill(GREEN)
        pygame.draw.line(screen, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT), 2)
        user.draw(screen)
        computer.draw(screen)
        ball.draw(screen)
        score_surface = font.render(f"{score_user} : {score_computer}", True, WHITE)
        screen.blit(score_surface, (WIDTH//2 - score_surface.get_width()//2, 20))

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == '__main__':
    difficulty = 'easy'
    if len(sys.argv) > 1:
        difficulty = sys.argv[1]
    main(difficulty)
