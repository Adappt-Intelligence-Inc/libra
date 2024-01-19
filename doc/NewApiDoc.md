    1. https://ipcamera.adapptonline.com:8080/api/register
    POST METHOD: 
    Request JSON Body:
    {
    "cameraid":"CAM123699",
    "firmwareVersion":"FIRM0001",
    "cameratype":"Baby-Monitor",
    "serviceid":"Kinesis-WEBRTC",
    "ptz":0
    }
    OUTPUT: {
        "access_key_id": "ASIAYAISQDEVIMDTTFQK",
        "secret_access_key": "d/15p3PPuYLXXRq31wUmA95bQzrge/PXDBkdNOmn",
        "session": "IQoJb3JpZ2luX2VjEA4aCmFwLXNvdXRoLTEiRzBFAiEA7rdx5JDYhFxJ0xhQr/W5mKx7Kl8kJs1mYXCSv7XexUUCIHe8j/8IQAekOxIgWeymkaCsFvVUAtRECkongEqfVWoZKp8CCLf//////////wEQAhoMNTUwMzMxNDg4NTU0Igw+ha55WQN1LLkWSBoq8wFT7Nqmo+D3FVFTgGFX6jWydPQpbpWTV2KQGRTaRSaTffp8gNCxUBhlfZCiIvzpm8rH89NK6y08A0tS1OOx5Bm9DBCa5xC8p2u49BhnlkzRK0IUmkpKYDJ/XIUGaaA+AiU53IguS/a+w4IkPKYP7UIlfIGeEd2nDGpAEfvQmKhfxJ2hp6brtSGO9K4tWzOnmgbWM1Hmdkidd4Zl5ulIyKpJthj7nhYXGqgTJZHsHNOEzkMkuPDqtEfsEOLDHSExyQqWTFrnNMUS5J+d4O2g8SC8J0DfkLAG/d+XpLg4qyHZT31v8yLtMtqJ2h9MeSHT0vNWd7kw9t6drQY6nQGrsqvdzMf62h6DwqUKJ7O94GRzpkajELRWYmHk343wHL1qrstVEq4MPo7aRg64pY7u/IQtc/qL8fZm+JNFyls8UaekwKVY0w0IeEx4wDFWEIO3Gmaz8gjAwVuhHl2/8ENlM2a1RM9GFUKaxxKh0ptibirzQp7AdxIqzFAiFPQHZ30FILvjkGEzjUHYeHQxdJEI+hh/K02vpKiCMHN7"
    }

    2. https://ipcamera.adapptonline.com:8080/api/channel
    POST METHOD: 
    Request JSON Body:
    {
    "sessionid":"IQoJb3JpZ2luX2VjEA4aCmFwLXNvdXRoLTEiRzBFAiEA7rdx5JDYhFxJ0xhQr/W5mKx7Kl8kJs1mYXCSv7XexUUCIHe8j/8IQAekOxIgWeymkaCsFvVUAtRECkongEqfVWoZKp8CCLf//////////wEQAhoMNTUwMzMxNDg4NTU0Igw+ha55WQN1LLkWSBoq8wFT7Nqmo+D3FVFTgGFX6jWydPQpbpWTV2KQGRTaRSaTffp8gNCxUBhlfZCiIvzpm8rH89NK6y08A0tS1OOx5Bm9DBCa5xC8p2u49BhnlkzRK0IUmkpKYDJ/XIUGaaA+AiU53IguS/a+w4IkPKYP7UIlfIGeEd2nDGpAEfvQmKhfxJ2hp6brtSGO9K4tWzOnmgbWM1Hmdkidd4Zl5ulIyKpJthj7nhYXGqgTJZHsHNOEzkMkuPDqtEfsEOLDHSExyQqWTFrnNMUS5J+d4O2g8SC8J0DfkLAG/d+XpLg4qyHZT31v8yLtMtqJ2h9MeSHT0vNWd7kw9t6drQY6nQGrsqvdzMf62h6DwqUKJ7O94GRzpkajELRWYmHk343wHL1qrstVEq4MPo7aRg64pY7u/IQtc/qL8fZm+JNFyls8UaekwKVY0w0IeEx4wDFWEIO3Gmaz8gjAwVuhHl2/8ENlM2a1RM9GFUKaxxKh0ptibirzQp7AdxIqzFAiFPQHZ30FILvjkGEzjUHYeHQxdJEI+hh/K02vpKiCMHN7",
    "cameraid":"CAM123699"
    }
    OUTPUT: CAM123699

    3. Steps for Uploading Firmware to storage bucket.
    • Make sure you have python3 installed and pip install boto3 on your end.
    • Execute python script attached in the mail, i.e. s3_File_Upload.py.
    • In the s3_File_Upload.py replace Access_key, Secret_key, Session_token with dynamic keys generated using https://ipcamera.adapptonline.com:8080/api/register API.
    • File uploaded successfully.

 	4. Dummy firmware from HTTPS download link.
    Bucket name :ip-camera-storage & Bucket ARN : arn:aws:s3:::ip-camera-storage

	Examples:
	Note: replace sdfirm-1.0.0.tar.gz with the file name you need to download.
    https://ip-camera-storage.s3.ap-south-1.amazonaws.com/sdfirm-1.0.0.tar.gz
    https://ip-camera-storage.s3.ap-south-1.amazonaws.com/TDX20-v2.4.2.zip
