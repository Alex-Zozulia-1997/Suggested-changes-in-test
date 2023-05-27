import email
import requests
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def main():
    try:
        if len(sys.argv) != 3:
            sys.exit("You need to provide two command-line arguments for API and email")

        # Get the command-line arguments
        chosen_api = sys.argv[1]
        email_address = sys.argv[2]

        email_obj = email.utils.parseaddr(email_address)
        if not (email_obj[1] and '@' in email_obj[1] and '.' in email_obj[1]):
            sys.exit("Invalid email address")

        # Call the appropriate function based on the argument
        if chosen_api.lower() == 'london':
            weather_data = weather_api()
            books_data = None
        elif chosen_api.lower() == 'harry potter and the philosopher stone':
            books_data = books_api()
            weather_data = None
        else:
            print("This is an Invalid API name:", chosen_api)
            return

        if books_data or weather_data:
            send_email(email_address, chosen_api, books_data, weather_data)
            print("Email sent successfully!")

    except IndexError:
        sys.exit("Missing command-line argument")

    except (ValueError, IndexError, KeyError):
        sys.exit("Command-line argument is not a valid API name")


def weather_api():
    try:
        api_key = "86f4149d8377d62706ba398ff1f54f88"
        url = "http://api.openweathermap.org/data/2.5/weather?q=london&appid=" + api_key
        response = requests.get(url)
        weather = response.json()

        # Extract the weather details from the API response
        if "main" in weather:
            temperature = weather['main']['temp']
            weather_conditions = weather['weather'][0]['main']
            weather_description = weather['weather'][0]['description']
            humidity = weather['main']['humidity']
            pressure = weather['main']['pressure']
            wind_speed = weather['wind']['speed']
            wind_direction = weather['wind']['deg']
            cloudiness = weather['clouds']['all']

            # Return the extracted details as a dictionary
            final_message = {"temperature": temperature,
                "weather_conditions": weather_conditions,
                "humidity": humidity,
                "pressure": pressure,
                "weather_description": weather_description,
                "wind_speed": wind_speed,
                "wind_direction": wind_direction,
                "cloudiness": cloudiness}
            return final_message



    except requests.RequestException:
        pass


def books_api():
    try:
        api_key = "AIzaSyAcZrf7sNAuIXFo1PdXZo_VkJ0LrNvPOZs"
        url = "https://www.googleapis.com/books/v1/volumes?q=harry+potter+and+the+philosopher's+stone&key=" + api_key
        response = requests.get(url)
        books = response.json()

        # Extract the details from the API response
        if "items" in books:
            book = books["items"][0]["volumeInfo"]
            book_id = books["items"][0]["id"]
            title = book.get("title", "")
            authors = book.get("authors", [])
            description = book.get("description", "")
            publisher = book.get("publisher", "")
            published_date = book.get("publishedDate", "")
            categories = book.get("categories", [])

            # Return the extracted details as a dictionary
            details ={
                "book_id": book_id,
                "title": title,
                "authors": authors,
                "description": description,
                "publisher": publisher,
                "published_date": published_date,
                "categories": categories
            }
            #print(details)
            return details


    except requests.RequestException:
        pass


def send_email(email_address, chosen_api, books_data=None, weather_data=None):
    msg = MIMEMultipart()
    msg['From'] = "emnaemna092@gmail.com"
    msg['To'] = email_address
    msg['Subject'] = "Your Requested Data from API"

    if chosen_api.lower() == 'london' and weather_data:
        message = "\n\nRequested Weather Information:\n"
        for key, value in weather_data.items():
            message += f"{key}: {value}\n"
    elif chosen_api.lower() == 'harry potter and the philosopher stone' and books_data:
        message = "\n\nRequested Book details:\n"
        for key, value in books_data.items():
            message += f"{key}: {value}\n"
    else:
        message = "No data found for the chosen API."

    msg.attach(MIMEText(message, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login("emnaemna092@gmail.com", "mpqc xzyi wamo swdo")
        server.send_message(msg)
        server.quit()

    except smtplib.SMTPException as e:
        print("An error occurred while sending the email:", str(e))


if __name__ == "__main__":
    main()


#the keybinds learned during this sprint are below:
# Ctrl + / to comment and uncomment multiple lines of code
# Ctrl + ` to open the terminal
# Ctrl + Shift + F to search for files
# ctrl + f to search for certain words
# ctrl + b to open and close the side bar