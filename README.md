# FideliusJS

```
    _______     __     ___
   / ____(_)___/ /__  / (_)_  _______
  / /_  / / __  / _ \/ / / / / / ___/
 / __/ / / /_/ /  __/ / / /_/ (__  )
/_/   /_/\__,_/\___/_/_/\__,_/____/
```

A node-based cli implmentation of Fidelius. Secret sharing, encrypted end-to-end.

## Quickstart

```
$ npm install -g fidelius
```

If you do not have an organization key, head over to the [Tozny Innovault Console](https://console.tozny.com/) and sign up. Once logged in go to **Manage Clients** and create a new Client Registration Token. This is your organization key.

Run the Fidelius command and enter your organization key, set an organization nickname, and either create a new user or enter your user credentials.

```
$ fidelius
>> No current user. Setting a user.
>> No users found. Make a new one?
>> No current organization. Setting a new current organization.
>> No organizations found. Make a new one?
? Organization Token: <token>
? Organization Name (for local use): My Organization
>> The Testing organization has been added
>> Testing is now the active organization.
? Create a new user, or use and existing one?
❯ New
  Existing
? User Nickname: Luke
```

Start sharing secrets! You'll need the key of the user you want to share with. You can find your user's key by running the `fidelius` command.

```
$ fidelius new
? Message Title: My Title
? Message: Received
? Who should this message be shared with?
❯◉ New Friend
? Client ID: <friend's user key>
? Friend's Nickname (for local use): Ashley
>> The messsage My Title has been shared.
```

Read secrets others have shared with you.

```
$ fidelius read
? Select a message to read:
❯ My Title shared from Luke
  Another Message shared from Eric

Message ID: <message-id>
Shared By: Luke
Title: My Title

This is my secret message to you.
```

## Managing Your Settings

There are three types of settings to manage, organization, user, and friends. All of these can be added and removed.

```
$ fidelius add org
$ fidelius add user
$ fidelius add friend
$ fidelius remove org
$ fidelius remove user
$ fidelius remove friend
```

### Oragnizations

An org consists of a registration key and and name. You can define as many organizations as you need, only one organization is active at a time. To change the active organization you can use the `change org` command.

```
$ fidelius change org
```

An organization contains users and friends. Changing the active organization changes the users and friends that are available.

### Users

A user a set of keys that are used for sharing information. A user belongs to an organization. When you create a new user, a set of keys is generated for that user so that they can share messages to friends who also have users registered to the organization.

Only one user is active at a time, though many users can be defined. To change the user that is currently active use the `change user` command.

```
$ fidelius change user
```

#### Exporting a User

If you need to migrate a user to another instance of fidelius, you can export the user with the export command

```
$ fidelius export
```

This will print a user's full set of keys so you can transfer them to another Fidelius instance if needed.

_**Note:** It is important not to allow your secret keys to become public. There is no real layer of security on your computer for your keys. Similar to your ssh keys, the Fidelius configuration is stored in a static file on your machine. All messages are encrypted before moving over the network connection, but that encryption is only strong while your secret keys remain secret._

### Friends

A friend is another user of fidelius registered to the same organization. To share messages, you must first add other users as friends. You can add a friend while creating a new message if needed.

To add a friend, you need their user key. You can find your active organization and active user keys by running the `fidelius` command with no arguments.

Once a friend has provided you their key, you can add them to your friends list and give them a nickname. You can then elect to share secrets with them when authoring messages.

Friends are stored at the organization level. If you have multiple users defined, they will share the list of friends on the network.

## Managing Messages

### Reading Messages

You can read any message that has been shared with your user by running the `read` command.

```
$ fidelius read
```

This will print a list of messages shared and allow you to select one to view its contents.

If you now the ID of the message that has been shared, you can skip the listing of messages and pull up the message directly using the `--key` flag.

```
$ fidelius read --key="<message-id>"
```

### Creating Messages

Once you have an active organization and active user, you can create, share, and manage secrets with your friend list. To create a new message use the `new` command and follow the prompts to author and share the message with one of your friends.

```
$ fidelius new
```

You can choose to share a message with multiple friends when you create it.

### Managing Messages

You can manage the messages you have created with the `list` command. Running list will give you a listing of all the messages you have created.

```
$ fidelius list
```

After selecting the messages to manage, you can then perform actions on them, such as expiring the message, removing a friends access to the data, and destroying the record. It is recommended that you expire messages that have been read and are no longer neede by friedns.

## New Software

The Node version of fidelius is brand new. Please feel free to review the software and make suggestions for how it might be improved. Vet the approach before relying on Fidelius Node.

### Requirements

Fidelius JS is not using Babel to transpile the Javascript. Internally it uses async/await to manage asynchronous processing. This means you must have **Node v7.10.1 or higher*** to run Fidelius.

## e3db

Fidelius is built around the end-to-end ecrypted database from [Tozny](https://tozny.com/). The database and it's various SDKs enable secure record store. Data is encrypted on the client before it even touches the network, stays encrypted in the database, and is only dycrypted again once it is at it's final destination. As long as your secret keys remain secret, your data remains protected.

To learn more about e3edb visit [Tozny's e3db page](https://tozny.com/e3db/) and get started.
