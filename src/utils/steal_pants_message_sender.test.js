const { sendStealPantsMessage } = require('./steal_pants_message_sender');

function generateMockMessage() {
  return {
    channel: {
      send: jest.fn()
    }
  }
}

function generateMockPickedUser(nickname) {
  return {
    nickname: nickname,
    user: {
      username: 'User001'
    }
  }
}

describe('Test sendStealPantsMessage', () => {
  let message;

  beforeEach(() => {
    message = generateMockMessage();
  });
  
  test('When having a nickname in the picked user', () => {
    const pickedUser = generateMockPickedUser('User');

    sendStealPantsMessage(message, pickedUser);

    expect(message.channel.send).toHaveBeenCalledWith("User 的內褲被和真偷了!");

  });

  test('When not having a nickname in the picked user', () => {
    const pickedUser = generateMockPickedUser(null);

    sendStealPantsMessage(message, pickedUser);

    expect(message.channel.send).toHaveBeenCalledWith("User001 的內褲被和真偷了!");
  });

});