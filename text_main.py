import sys
from apiemail import weather_api, books_api

def test_main():
    test_books_api()
    test_books_api()

    # # Test case 1: Valid API and email address
    # sys.argv = ['apiemail.py', 'London', 'user@example.com']

    # assert apiemail.main() is None

    # # Test case 2: Invalid API name
    # sys.argv = ['api.js', 'food_api', 'user-example!com']

    # assert apiemail.main() is None


def test_books_api():
    assert books_api() == {'book_id': 'lfYuvgAACAAJ', 'title': "Harry Potter and the Philosopher's Stone - Gryffindor Edition", 'authors': ['J. K. Rowling'], 'description': "Gryffindor, Slytherin, Hufflepuff, Ravenclaw ... Twenty years ago these magical words and many more flowed from a young writer's pen, an orphan called Harry Potter was freed from the cupboard under the stairs - and a global phenomenon started. Harry Potter and the Philosopher's Stone has been read and loved by every new generation since. To mark the 20th anniversary of first publication, Bloomsbury has published four House Editions of J.K. Rowling's modern classic. These stunning editions each feature the individual house crest on the jacket and line illustrations exclusive to that house, by Kate Greenaway Medal winner Levi Pinfold. Exciting new extra content includes fact files and profiles of favourite characters, and each book has sprayed edges in the house colours. Available for a limited period only, these highly collectable editions are a must-have for all Harry Potter fans.", 'publisher': "Bloomsbury Children's Books", 'published_date': '2017', 'categories': ["Children's stories"]}

def test_weather_api():
    keys = ["temperature", "weather_conditions", "humidity", "pressure", "weather_description","wind_speed", "wind_direction", "cloudiness"]

    for key in keys:
        assert key in weather_api()

test_main()