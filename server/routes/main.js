const express = require('express')
const router = express.Router()

// import the model for your news-app db items
const Article = require('../models/Article')

//Routes
router.get('', async (req, res) => {
    const locals = {
        title: 'Ergo News App',
        description: 'News application prototype created with Mongo, Express, and Node'
    }

    try {
        const data = await Article.find()
        console.log('* SERVER>ROUTES>MAIN: rendering VIEWS>INDEX.EJS')
        console.log('* SERVER>ROUTES>MAIN: applying the layout from VIEWS>LAYOUTS>MAIN.EJS')
        res.render('index', { locals, data })
    } catch (error) {
        console.log('* SERVER>ROUTES>MAIN: error! :( could not render page')
    }

    
})

// router.get('', (req, res) => {
//     console.log('* SERVER>ROUTES>MAIN: rendering VIEWS>INDEX.EJS')
//     console.log('* SERVER>ROUTES>MAIN: applying the layout from VIEWS>LAYOUTS>MAIN.EJS')
//     res.render('index')
// })

router.get('/about', (req, res) => {
    console.log('* SERVER>ROUTES>MAIN: rendering VIEWS>ABOUT.EJS')
    console.log('* SERVER>ROUTES>MAIN: applying the layout from VIEWS>LAYOUTS>MAIN.EJS')
    res.render('about')
})

// function insertArticleDatum () {
//     Article.insertOne({
//         "image": "./public/img/hfes-logo.png",
//         "categories": ["Professional Organizations"],
//         "title": "More Time to Apply — Application Deadline Extended to June 24",
//         "source": "HFES",
//         "date": "June 17, 2025",
//         "summary": "HFES has extended the application deadline for the Alphonse Chapanis Award to June 24. This $2,000 award honors outstanding human factors research and will be presented at the ASPIRE 2025 Annual Meeting.",
//         "link": "https://www.hfes.org/Events/ASPIRE-International-Annual-Meeting/Registration/Register-to-Attend"
//     })
// }

// function insertArticleData () {
//     Article.insertMany([
//         {
//             "image": "./img/Trinity_College-Logo.png",
//             "categories": ["Research & Academia", "Continuing Education"],
//             "title": "Watch our video about HEPS Conference 2025",
//             "source": "Trinity College Dublin",
//             "date": "June 17, 2025",
//             "summary": "Trinity College Dublin shares highlights of the 2025 HEPS conference, emphasizing innovations in ergonomics, human performance, and workplace health solutions.",
//             "link": "https://www.tcd.ie/psychology/news/latest-news/watch-our-video-about-heps-conference-2025/"
//             },
//             {
//             "image": "./img/Time_Manage-Logo.png",
//             "categories": ["Research & Academia"],
//             "title": "What Are The Basic Principles Of Ergonomics?",
//             "source": "YouTube",
//             "date": "June 17, 2025",
//             "summary": "This video outlines key ergonomic principles to enhance comfort, safety, and productivity at work. Topics include posture, adjustability, tool alignment, movement, visual ergonomics, and workspace organization.",
//             "link": "https://www.youtube.com/watch?v=CAAe_zSjT4E"
//             },
//             {
//             "image": "./img/Env_Pro-Logo.png",
//             "categories": ["Research & Academia"],
//             "title": "Why Microbreaks Might Be the Most Underrated Ergonomics Tool at Work",
//             "source": "Environmental Protection",
//             "date": "June 16, 2025",
//             "summary": "Microbreaks are gaining attention as essential tools for reducing workplace fatigue and improving ergonomic outcomes, especially for desk-bound professionals.",
//             "link": "https://eponline.com/articles/2025/06/16/why-microbreaks-might-be-the-most-underrated-ergonomics-tool-at-work.aspx"
//             },
//             {
//             "image": "./img/osh_Canadian.png",
//             "categories": ["Industry"],
//             "title": "Human factors as a strategy to control challenges in manufacturing",
//             "source": "OHS Canada",
//             "date": "June 14, 2025",
//             "summary": "Human factors are being used as strategic tools to address complex challenges in manufacturing, with emphasis on error reduction and productivity gains.",
//             "link": "https://www.ohscanada.com/opinions/human-factors-as-a-strategy-to-control-challenges-in-manufacturing/"
//             },
//             {
//             "image": "./img/linkedin-logo.png",
//             "categories": ["Research & Academia"],
//             "title": "'Ergonomics & Human factors: fade of a discipline' + responses",
//             "source": "LinkedIn",
//             "date": "June 13, 2025",
//             "summary": "Ben Hutchinson explores the declining visibility of ergonomics and human factors, proposing strategic responses to revitalize the discipline in industry and academia.",
//             "link": "https://www.linkedin.com/pulse/ergonomics-human-factors-fade-discipline-responses-ben-hutchinson-xentc"
//             },
//             {
//             "image": "./img/RM-Logo.png",
//             "categories": ["Industry", "Tools & Technology"],
//             "title": "Exoskeleton Market Research and Global Forecast Report 2025-2030: Powered Exoskeletons Lead Growth with Robust Investment Activities, Industrial Adoption Amplifies Expansion",
//             "source": "GlobeNewswire",
//             "date": "June 12, 2025",
//             "summary": "The global exoskeleton market will grow through 2030, led by powered exoskeletons. Industrial use and investment are key drivers of this expansion trend.",
//             "link": "https://www.globenewswire.com/news-release/2025/06/12/3098454/28124/en/Exoskeleton-Market-Research-and-Global-Forecast-Report-2025-2030-Powered-Exoskeletons-Lead-Growth-with-Robust-Investment-Activities-Industrial-Adoption-Amplifies-Expansion.html"
//             },
//             {
//             "image": "./img/Stock_Titan-Logo.png",
//             "categories": ["Research & Academia"],
//             "title": "New Findings from NSC Grant Recipients Help Tackle America's Most Common Workplace Injury",
//             "source": "Stock Titan",
//             "date": "June 10, 2025",
//             "summary": "New data from National Safety Council grant recipients reveal high-risk areas in Amazon’s warehouses. The research aims to reduce musculoskeletal disorders (MSDs) through targeted ergonomics solutions, emphasizing the need for systemic safety improvements.",
//             "link": "https://www.stocktitan.net/news/AMZN/new-findings-from-nsc-grant-recipients-help-tackle-america-s-most-is2ovwa34obx.html"
//             },
//             {
//             "image": "./img/Transparent-FastCo-Logo.png",
//             "categories": ["Industry"],
//             "title": "5 things you're getting wrong about sitting at your desk, according to an ergonomics expert",
//             "source": "Fast Company",
//             "date": "June 10, 2025",
//             "summary": "Ergonomist Rachel Mitchell highlights common desk posture mistakes, such as unsupported feet and incorrect screen height. The article offers practical fixes that can prevent discomfort and long-term injuries in office settings.",
//             "link": "https://www.fastcompany.com/91346282/things-youre-getting-wrong-about-sitting-at-your-desk-according-to-an-ergonomics-expert"
//             },
//             {
//             "image": "./img/Bloomberg_Law-Logo.png",
//             "categories": ["Regulations & Policy"],
//             "title": "Safety Inspection Update Points OSHA at Warehouses, Health Care",
//             "source": "Bloomberg Law",
//             "date": "June 10, 2025",
//             "summary": "OSHA’s updated inspection priorities now target warehouses and healthcare facilities due to rising safety violations. The focus includes ergonomics-related injuries, reflecting federal efforts to strengthen workplace health enforcement.",
//             "link": "https://news.bloomberglaw.com/us-law-week/safety-inspection-update-points-osha-at-warehouses-health-care"
//             },
//             {
//             "image": "./img/texasam-university-ergonomics-center-logo.png",
//             "categories": ["Research & Academia"],
//             "title": "Virtual Reality Interface Design Affects Users Both Physically And Mentally",
//             "source": "Texas A&M University",
//             "date": "June 10, 2025",
//             "summary": "A Texas A&M study finds that virtual reality interface design significantly influences user posture, fatigue, and cognitive load. Researchers stress the need for ergonomically sound VR development, especially for long-term use.",
//             "link": "https://stories.tamu.edu/news/2025/05/06/virtual-reality-interface-design-affects-users-both-physically-and-mentally/"
//             },
//             {
//             "image": "./img/OTS_News-Logo.png",
//             "categories": ["Industry"],
//             "title": "Your Chair Might Be Killing Your Productivity—Here’s Why",
//             "source": "OTS News",
//             "date": "June 10, 2025",
//             "summary": "Poor chair design can impair focus and efficiency. This article explains how proper ergonomics can improve productivity in remote and office workspaces.",
//             "link": "https://www.otsnews.co.uk/your-chair-might-be-killing-your-productivity-heres-why/"
//             },
//             {
//             "image": "./img/GQ_Magazine-Logo.png",
//             "categories": ["Industry"],
//             "title": "How to fix your posture – because being hunched could be killing you",
//             "source": "GQ Magazine",
//             "date": "June 10, 2025",
//             "summary": "GQ explores how poor posture develops and shares expert tips to improve spinal health through better ergonomics, movement habits, and awareness.",
//             "link": "https://www.gq-magazine.co.uk/article/how-to-fix-your-posture"
//             },
//             {
//             "image": "./img/OKState-Logo.png",
//             "categories": ["Professional Organizations"],
//             "title": "Human Factors and Ergonomics Society showcases versatility of human factors to OSU students",
//             "source": "Oklahoma State University",
//             "date": "June 10, 2025",
//             "summary": "Oklahoma State University has established a chapter of the Human Factors and Ergonomics Society (HFES) within its College of Engineering, Architecture and Technology. The chapter aims to provide students with additional learning opportunities outside the classroom, support their academic performance, and prepare them for careers in human factors engineering. The organization is co-advised by Dr. Katie Jurewicz and Dr. Pratima Saravanan, with graduate research assistant Matt Nare serving as president. The chapter is affiliated with the national HFES, offering students access to a network of professionals and national conferences.",
//             "link": "https://news.okstate.edu/articles/engineering-architecture-technology/2025/osu_starts_chapter_of_human_factors_and_ergonomics_society.html"
//             },
//             {
//             "image": "./img/Discover_Eng-Logo.png",
//             "categories": ["Research & Academia", "Professional Organizations"],
//             "title": "Human Factors and Ergonomics in Industrial Engineering",
//             "source": "Discover Engineering",
//             "date": "June 10, 2025",
//             "summary": "Human Factors and Ergonomics (HFE) is a critical discipline within Industrial Engineering that focuses on optimizing the interaction between humans and systems. This field aims to enhance productivity, safety, and comfort by designing systems that accommodate human capabilities and limitations. The importance of HFE in engineering cannot be overstated, as it directly impacts the efficiency and well-being of workers, the quality of products, and the overall performance of industrial operations. This article delves into the various aspects of Human Factors and Ergonomics in Industrial Engineering, exploring its fundamentals, historical development, applications, advanced topics, challenges, and considerations.",
//             "link": "https://www.discoverengineering.org/human-factors-and-ergonomics-in-industrial-engineering/"
//             },
//             {
//             "image": "./img/Macnifico-Logo.png",
//             "categories": ["Industry"],
//             "title": "Exoskeleton Robotics for Occupational Safety Market 2025: Surge in Adoption Drives 18% CAGR Through 2029",
//             "source": "Macnifico",
//             "date": "June 9, 2025",
//             "summary": "The global market for exoskeleton robotics in occupational safety is projected to grow at an 18% CAGR through 2029, driven by advancements in wearable robotics, increased workplace safety regulations, and rising awareness of occupational health. Companies like SuitX, Ottobock, and Honda Robotics are developing exoskeleton solutions to augment human strength, reduce fatigue, and minimize musculoskeletal injuries in sectors such as manufacturing, construction, and logistics. The integration of AI and IoT connectivity enables real-time monitoring of worker posture and fatigue, supporting proactive safety interventions.",
//             "link": "https://www.macnifico.pt/news-en/exoskeleton-robotics-for-occupational-safety-market-2025-surge-in-adoption-drives-18-cagr-through-2029/96916/"
//             },
//             {
//             "image": "./img/Noticias-Logo.png",
//             "categories": ["Industry", "Tools & Technology"],
//             "title": "Textile-Based Exoskeleton Technologies Market 2025: Smart Fabrics Drive 18% CAGR Amid Healthcare & Industrial Surge",
//             "source": "Noticias",
//             "date": "June 9, 2025",
//             "summary": "Textile-based exoskeleton technologies are experiencing significant growth, with the market expected to expand at an 18% CAGR through 2029. Innovations in smart fabrics, such as conductive fibers and shape-memory polymers, are enhancing the comfort and functionality of wearable assistive devices. These advancements are particularly beneficial in healthcare and industrial applications, where they assist with mobility, reduce fatigue, and minimize the risk of musculoskeletal injuries. Companies like SuitX, Samsung, and Sarkari Exoskeleton are leading the development of these technologies.",
//             "link": "https://lisboatv.pt/news_en/textile-based-exoskeleton-technologies-market-2025-smart-fabrics-drive-18-cagr-amid-healthcare-industrial-surge/59429/"
//             },
//             {
//             "image": "./img/Canadian_OC_Safety-Logo.png",
//             "category": ["Regulations & Policy"],
//             "title": "Safe by Design, Not by Chance",
//             "source": "Canadian Occupational Safety",
//             "date": "June 9, 2025",
//             "summary": "Ontario's latest campaign, 'Safe by Design, Not by Chance,' empowers employers to eliminate avoidable risks at the source. The initiative focuses on redesigning systems and environments to prevent injuries, rather than relying solely on worker behavior. The campaign targets sectors with high rates of injuries, such as retail, warehousing, and manufacturing, emphasizing the importance of proactive safety measures and system-wide prevention strategies to reduce workplace hazards and protect workers.",
//             "link": "https://www.thesafetymag.com/ca/topics/safety-and-ppe/safe-by-design-not-by-chance/538451"
//             },
//             {
//             "image": "./img/Biznes_NewSeria-Logo.png",
//             "categories": ["Industry"],
//             "title": "Sam Logistics Partners with Vestil Manufacturing to Enhance Warehouse Solutions",
//             "source": "EIN Newswire - Newseria Biznes",
//             "date": "June 9, 2025",
//             "summary": "Sam Logistics & Supplies Inc. has partnered with Vestil Manufacturing to enhance warehouse solutions by integrating advanced material handling components. The collaboration aims to improve ergonomics and safety while streamlining operations in warehouses and distribution centers. The product lineup includes heavy-duty equipment like forklifts, pallet jacks, conveyors, and customizable storage solutions, all designed to boost warehouse capacity and ensure compliance with safety standards.",
//             "link": "https://biznes.newseria.pl/ze-swiata/ein-newswire/sam-logistics-partners,b1440797450"
//             },
//             {
//             "image": "./img/Philstar_Global-Logo.png",
//             "categories": ["Industry"],
//             "title": "Innovators Champion Ergonomics for Sustainability",
//             "source": "Philstar Global",
//             "date": "June 8, 2025",
//             "summary": "Innovators are championing ergonomics as a key factor in sustainability efforts, recognizing that well-designed work environments can lead to improved productivity, reduced waste, and enhanced worker well-being. By integrating ergonomic principles into product design and workplace layouts, companies are not only fostering a healthier workforce but also contributing to environmental sustainability. This approach aligns with global trends towards sustainable development and responsible business practices.",
//             "link": "https://www.philstar.com/business/2025/06/08/2448855/innovators-champion-ergonomics-sustainability"
//             },
//             {
//             "image": "./img/Interesting_Eng.png",
//             "categories": ["Industry", "Tools & Technology"],
//             "title": "Headless Humanoid Robot Built in 40 Days to Work in Renault Factory",
//             "source": "Interesting Engineering",
//             "date": "June 10, 2025",
//             "summary": "Wandercraft has developed a headless humanoid robot named Calvin in just 40 days to perform manufacturing tasks at Renault's factory. The voice-controlled, self-balancing robot is designed to relieve workers from painful and non-ergonomic tasks, improving productivity and reducing physical strain. The collaboration between Wandercraft and Renault aims to integrate Calvin into industrial environments, enhancing worker safety and operational efficiency.",
//             "link": "https://interestingengineering.com/innovation/calvin-humanoid-robot-work-at-renault"
//             }
//     ])
// }

// insertArticleDatum()

// insertArticleData()

//Export
module.exports = router
