const puppeteer = require('puppeteer');
// run: tsc then node
let scrape = async() =>{
    const browser= await puppeteer.launch()
    const page = await browser.newPage();
    // go to the website page
    await page.goto('https://arts.vcu.edu/music/events/');
    await page.waitFor(2000);
    //scrape
    var isLastPage = false;
    const result = await page.evaluate(()=>{
        // loop
        let data = [];
        const allSubMenus : NodeListOf<Element> = document.querySelectorAll("[id^='post']");
        // loop through all posts
        try { 
            for (let i = 1; i < allSubMenus.length; i++){ 
                    let post = document.querySelectorAll("[id^='post']")[i]     
                    let title = post.querySelector('header.article-header h1.post-title a').textContent; 
                    let details = post.querySelector('section.entry-content p').textContent.split(/\n/) 
                    let time = details[0];
                    let place = details[1]+details[2];
                    let ticket = details[3];
                    data.push({title, time,place,ticket});
                }
            }
        // } catch (e) {
        //     console.log(e); 
        // }
        catch {
            isLastPage = true;
        }
        return data;
    });
    if (!isLastPage) {      
              await page.evaluate(
                (buttonSelector) => {
                  var pagerElem = document.querySelector(buttonSelector);
                  if (pagerElem) { 
                    pagerElem.click("page-navigation.bones_page_navi li a");
                  }
                }, 
                'button[title="Next"]');
        
              console.log('paging to next...')
            }      
    browser.close();
    return result;
};

scrape().then((value)=>{
    console.log(value);
});

// do {
//     //capture from main page - 
//     //if there's no matching selector, exception is thrown, 
//     //which will be interpreted as 'last page'
//     try {
//       [log, results, isLastPage] = await 
//         page.$$eval<[models.CaptureLog, models.CaptureResults, boolean], models.CaptureResults, models.CaptureLog, any>(
//           channelCfg.DAY_EVENT_SELECTOR, 
//           parseMainCscPageBrowserFn,
//           results,
//           log,
//           bundledRuntimeDependencies
//       );
//     } catch {
//       isLastPage = true;
//     }
    
//     //page forward
//     if (!isLastPage) {      
//       await page.evaluate(
//         (buttonSelector) => {
//           var pagerElem = document.querySelector(buttonSelector);
//           if (pagerElem) {
//             pagerElem.click();
//           }
//         }, 
//         'button[title="Next"]');

//       console.log('paging to next...')
//     }      
//     await page.waitFor(5000);
//   } while (!isLastPage)


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



