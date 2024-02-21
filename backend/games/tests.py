import random

from django.test import TestCase

from games.models import PingPongGame, Ball, Racket, Player, PingPongMap

from users.models import User


class PingPongGameTestCase(TestCase):
    def setUp(self):
        self.left_side_player = User.objects.create_user(
            nickname='왼쪽',
            email='left@test.com',
        )
        self.right_side_player = User.objects.create_user(
            nickname='오른쪽',
            email='right@test.com',
        )
        ping_pong_map = PingPongMap(1920, 1080)
        ball = Ball(10, ping_pong_map.width / 2, ping_pong_map.height / 2)
        left_side_racket = Racket(10, 100, 10, ping_pong_map.height / 2, speed=10)
        right_side_racket = Racket(10, 100, ping_pong_map.width - 10, ping_pong_map.height / 2, speed=10)
        left_side_player = Player(self.left_side_player, 0, racket=left_side_racket)
        right_side_player = Player(self.right_side_player, 0, racket=right_side_racket)
        self.ping_pong_game = PingPongGame(
            left_side_player=left_side_player,
            right_side_player=right_side_player,
            ping_pong_map=ping_pong_map,
            ball=ball,
        )

    def tearDown(self):
        self.left_side_player.delete()
        self.right_side_player.delete()

    def test_set_ball(self):
        self.ping_pong_game.ball.set_direction((-1, 0))
        self.ping_pong_game.ball.set_speed(10)
        self.ping_pong_game.ball.set_x_y(10, 10)
        self.assertEqual(self.ping_pong_game.ball.direction, (-1, 0))
        self.assertEqual(self.ping_pong_game.ball.speed, 10)
        self.assertEqual(self.ping_pong_game.ball.x, 10)
        self.assertEqual(self.ping_pong_game.ball.y, 10)

    def test_set_ball_direction_fail(self):
        direction = (random.uniform(1.1, 2), random.uniform(-1, 1))
        with self.assertRaises(ValueError):
            self.ping_pong_game.ball.set_direction(direction)

    def test_set_racket_position(self):
        self.ping_pong_game.left_side_player.racket.set_x_y(10, 10)
        self.assertEqual(self.ping_pong_game.left_side_player.racket.x, 10)
        self.assertEqual(self.ping_pong_game.left_side_player.racket.y, 10)

    def test_move_ball(self):
        self.ping_pong_game.ball.set_direction((-1, 0))
