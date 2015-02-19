# Thought Drop

Thought Drop creates serendipitous message discovery as users go about their day. You can leave a public note, or a private one for your friends! See what people are saying around you, both at the present and in the past!

## Team

  - __Product Owner__: Ryan Mccarter
  - __Scrum Master__: Robert Ing
  - __Development Team Members__: Peter Kim, Henry Wong, Robert Ing, Ryan Mccarter

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage
  - Send your friends a message that they'll receieve when they are near a certain location
  - Leave public messages for people around you to talk about what's on your mind and what's happening right now, 

## Requirements

- Node
- Express
- Mongo
- Mongoose
- Ionic
- Cordova (along with several plugins)

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
npm install -g cordova ionic
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.file
```

### Other useful ionic commands
```
ionic platform add ios
ionic platform add android
```
- Before testing on an iOS device, you must be an Apple Developer. After each 
- After making changes on your Ionic app, and before testing on your device, you must perform a build of the respective platform app

```
ionic platform build ios
ionic platform build android
```

### Plugins
Thought Drop relies on several Cordova plugins to work properly. Use the following commands to add them:
```
cordova plugin add org.apache.cordova.geolocation
cordova plugin add org.apache.cordova.inappbrowser
```

### Roadmap

View the project roadmap [here](https://github.com/mightyplayground/mightyplayground/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
