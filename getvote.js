exports.getvote = () => {

    const fs = require('fs/promises')

    const tallyVotes = async (vote) => {
        try {
            const x = vote;
            let voteResult = await fs.readFile('votes.json', {encoding:'utf-8'});
            let data = JSON.parse(voteResult);
            data[x] += 1;

            data = JSON.stringify(data)
            await fs.writeFile('votes.json', data, {encoding:'utf-8'});

            // datestamp log
            voteResult = await fs.readFile('votes.json', {encoding:'utf-8'});
            const curDate = new Date();
            const log = `\n${curDate}: user_vote:${x}, tally:${voteResult}`
            await fs.writeFile('log.txt', log, {encoding:'utf-8', flag:'a'});


            if(x == 'A' || x == 'B' || x == 'C'){
                console.log(`Your vote for ${x} has been counted. Thank you for voting!`)
            } else {
                console.log('Thank you for voting.')
            }

        } catch(err){
            console.log(err);
        }
    } 

    // checks ballot entry then tally
    const readBallot = async () => {
        try {
            let ballot = await fs.readFile('ballot.txt', {encoding: 'utf-8'});
            ballot = ballot.toUpperCase();

            if (ballot.length == 0) {
                tallyVotes('Abstained');
                console.log('No vote found.');

            } else if (ballot == 'A'){
                tallyVotes(ballot);
                console.log('You voted A.');

            } else if (ballot == 'B') {
                tallyVotes(ballot);
                console.log('You voted B.');

            } else if (ballot == 'C') {
                tallyVotes(ballot);
                console.log('You voted C.');

            } else {
                tallyVotes('Invalid');
                console.log(`You voted ${ballot}. Your vote is invalid.`);
            };
        } catch(err) {
            tallyVotes('Abstained');
            console.log('No vote found.');
        }
    }

    // check if the file exists then run function
    const existsSync = require('fs').existsSync('votes.json');
    if (existsSync) {
        readBallot();

    } else {
        const voteData = {"A":0,"B":0,"C":0,"Invalid":0,"Abstained":0};
        const createFile = JSON.stringify(voteData);
        fs.writeFile('votes.json', createFile, {encoding: 'utf-8'});

        console.log('File created. Votes are now being tallied.')

        readBallot();
    };
}