const puppeteer = require('puppeteer');

let scrape = async() =>{
    const browser= await puppeteer.launch()
    const page = await browser.newPage();
    // go to the website page
    await page.goto('https://arts.vcu.edu/music/events/');

    await page.waitFor(2000);
    //scrape
    const result = await page.evaluate(()=>{
        // loop
        let data = [];// may be CaptureEvent?
        const allSubMenus : NodeListOf<Element> = document.querySelectorAll("[id^='post']");
        // loop through all posts
        try { 
            for (let i = 1; i < allSubMenus.length; i++){ 
                //let title = document.querySelectorAll("[id^='post']").item;
                // let title = document.querySelector('#post-11527 > header > h1 > a').textContent;
                // let date = document.querySelector('#post-11527 > section > p > strong').textContent;
                    let post = document.querySelectorAll("[id^='post']")[i]     
                // let title = sub.childNodes[1].textContent;
                    let title = post.querySelector('header.article-header h1.post-title a').textContent; 
                    //title = title.replace(/\r?\n?\t?/g, '');// get rid of line breakers
                    let details = post.querySelector('section.entry-content p').textContent.split(/\n/) 
                    let time = details[0];
                    let place = details[1]+details[2];
                    let ticket = details[3];
                    // TODO: make this work
                    // let date = sub.childNodes[2].childNodes[1].children[1].textContent;
                    data.push({title, time,place,ticket});
                //// to select the place/price for only one post but does not working for now
                //// let place = document.querySelector('#post-11530 > section > p:nth-child(2)').textContent;
                //// let price = document.querySelector('#post-11527 > section > p:nth-child(4)').textContent;
                }
        } catch (e) {
            console.log(e); 
        }
        // return{
        //     title, date, place//, price
        // }
        return data;
    });
    //
    browser.close();
    return result;
};

scrape().then((value)=>{
    console.log(value);
});

export interface CaptureResults {
    tenantName: string;
    channelName: string;
    channelBaseUri: string;
    captureDt: string;    
    events: CaptureEvent[];
}

export interface CaptureEvent {
    venueName: string;  //if the site hosting the event has a name
    eventTitle: string;
    startDt: string;    
    endDt: string;
    doorTimeHours: number;
    doorTimeMin: number; 
    rawDoorTimeStr: string; 
    performers: CapturePerformer[];    // see CapturePerformer type below
    eventUris: string;//UriType[];
    eventDesc: string;
    ticketCostRaw: string; // if the ticket amounts dont fit into the door/advance buckets, just dump all the raw data into this field
    ticketCost: TicketAmtInfo[]; // see below
    ticketUri: string; // if there's another url for purchasing tickets
    miscDetail: string[]; //any extra lines of information that don't fit into other fields
    facebookShareUri:string; 
    twitterShareUri:string; 
    eventImageUris: string[];    
    venueAddressLines: string[];     
    program: ProgramItem[], // if they list any pieces of music          
}

export interface ProgramItem { 
    composer: string,
    title:string
}

export interface CapturePerformer {
    performerName: string;
    isPrimaryPerformer: boolean;
    performerUris: string[];
    performerImageUris: string[];
    savedPerformerImageUris: string[];
    performerDesc: string;
    performerRole: string;
}

export interface TicketAmtInfo {
    amt : number;
    qualifier : string; //"door" or "advance"
}



