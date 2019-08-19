from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

    def test_check_word(self):
        """Check if word guess is returned as json with appropriate response"""

        client = app.test_client()
        client.get('/')
        result = client.get('/check-word?word=blurgurlgelburg')

        self.assertEqual(result.status_code, 200)
        self.assertIn(b'not-word', result.data)