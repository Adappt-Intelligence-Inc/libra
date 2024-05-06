# Working with Manufacturer for hardware camera

## Presently we are looking for below H/W environment

### Tool chain requirement 

- Tool chain must support: 
`gcc540 in the firmware`

- We must be able compile the code with below options:
`std=c++11 and -muclibc`

## Moving to Firmware request
 
Points to understand about abilities:

Adappt will take care of the flow of Camera commissioning, cloud and mobile app. 

Expectation from Adappt: Camera Device along with firmware. 

# Forware requirment as below: 

- Adappt will handle the Login. Our server and Mobile app is in Just need of Device ID:
   `Please provide the Unique ID of the camera which comes with the 12 / 15 char word on sticker.`

Hardware Requirement as below:

1. Device ID / Unic ID / Streaming ID / Manufacturer ID is unic char printed on camera all are same.
   Size expectation 12 to 15 char.

2. Adappt mobile app supports user Registration. Once user registers and login is successfully.
   
3. The mobile app will open its default camera and scan for the QR code that is on the physical camera device.
   
	- Sticker on Camera Device (Unique ID is dependent on MacID-XXX - will be provided by Manufacturer).

	- Example- 65c108570948a03

4. Now the mobile app will generate a Single QR code embedded with user details, will show

```markdown
  - User ID
  - The Unique ID of the device that was fetched in the above scan,
  - SSID
  - Wi-Fi password to which the device is currently connected
```
Sample information you will get on mobile QR Code:

```
	{
		  "UserId":"ramkumar", 
		  "deviceId": "65c108570948a03",
		  "ssid": "adappt",
		  "pwd": "adappt@01"
	}
```
Now the mobile app is showing the above generated Mobile Wi-Fi QR code to the camera. The camera will read the QR code and get connected to the same Wi-Fi

5. Once the Device connected to Internet, it will starts webRTC streaming to Device ID / P2P ID.
```
Device ID / Unic ID / Streaming ID / Manufacturer ID are all same
```
# enabling the Face recognition. 

6. In this step, Adappt app will register the Device for Face recognition
```
AAPI4: Register (H/w): http://192.168.0.110:9002/registerDeviceX
```

7. Menwhile, activation of the Device is initiated
```
AAPI5: Activate Device (Step4 H/w): http://192.168.0.110:9002/activateDeviceX
```

8. Below API helps Adappt app to upload images to Xailient cloud.
```
AAPI6: Device Check: http://192.168.0.110:9002/deviceCheckinX
```
9. Below API helps Hardware to Download images from Xailient cloud.
```
AAPI7: FRX -Upload (Step9 App): http://192.168.197.122:9002/enableFRX
```

10. Below API helps in detection at the Camera H/w
```
AAPI8: FRX - Download (Step4 H/w):
```
