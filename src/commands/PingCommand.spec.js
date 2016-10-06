import chai, {
    expect
} from 'chai';

import PingCommand from './PingCommand';

describe('PingCommand', function() {
    describe('matches', function() {
        it('should match for messages that are "!ping"', function() {
            const message = {
                system: false,
                author: {
                    bot: false
                },
                cleanContent: '!ping'
            };

            const PingCommandInstance = new PingCommand(null);

            expect(PingCommandInstance.matches(message)).to.equal(true);
        });

        it('should not match for messages that aren\'t "!ping"', function() {
            const message = {
                system: false,
                author: {
                    bot: false
                }
            };

            const PingCommandInstance = new PingCommand(null);

            expect(PingCommandInstance.matches({
                ...message,
                cleanContent: '!ping after'
            })).to.equal(false);

            expect(PingCommandInstance.matches({
                ...message,
                cleanContent: 'before !ping'
            })).to.equal(false);

            expect(PingCommandInstance.matches({
                ...message,
                cleanContent: 'ping'
            })).to.equal(false);
        });
    });
});