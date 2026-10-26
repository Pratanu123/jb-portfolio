import { p, h2, table, type Post } from "./blocks";

export const linkedIn: Post[] = [
  {
    title: "Founder's branding perspective",
    blocks: [
      p("d)  Create 2 LinkedIn posts from a founder's branding perspective."),
      h2("1. Thought of the day"),
      p("A leader without compassion and empathy is just like a quartz clock without a battery: just a decorative item without any operational value"),
      h2("2.  Most successful leaders have the courage to accept failure. You cannot become a chef without burning a few dishes."),
    ],
  },
  {
    title: "Content calendar",
    blocks: [
      p("LinkedIn Posts"),
      p("Fill the calendar with 4 posts mentioned below."),
      p("• International festival Post - Creative copy, caption, hashtags, and CTA (Epiphany Day/Martin Luther King Day)"),
      p("• Indian festival Post - Creative copy, caption, hashtags, and CTA (Eid, Ugadi, Easter, Kannada Rajyotsava)"),
      p("• Cybersecurity Services - Creative copy, caption, hashtags, and CTA"),
      p("• Policy Checking Automation - Creative copy, caption, hashtags, and CTA"),
      p("• An assignment for you to proofread and improve (Please find attached below)"),
      table(
        [
          "Sr. No",
          "Post Type (SM Banner/ Video/ Carousel)",
          "Creative Copy (Text which will come on the Image/ Creative)",
          "Post Caption (Content which will come in the text area of LinkedIn)",
          "Hashtags",
          "CTA",
        ],
        [
          [
            "1",
            "SM Banner",
            "The day the world becomes free is the day when men and women start raising their voices",
            "“If you want to change the world, pick up your pen and write” (Content: Dr. Martin Luther King Jr. Day is around the corner. The famous civil rights leader is known for playing a significant role in the resistance against Jim Crow laws. Thanks to his bravery and heroic actions, the codified system of racial apartheid lost its lustre. To show solidarity towards his work and support his activism, let us all share our dreams on how we can make our world a better place with this “I have a dream” Activity”.",
            "#IHaveADream #MLKDay #SocialJustice #WeCareWeShare #EqualityPrevails #MartinLutherKingJr #NonViolence",
            "In the comment boxes, let us join our hands and pen our thoughts to make our society a better place to live.",
          ],
          [
            "2",
            "SM Banner",
            "Ugadi 2023",
            "Tick Tock Tick Tock…. Aaaannnnnd the New Year Begins (Content: It’s time for festivities and celebrations. Muggulu, torana, and new gifts have marked the onset of Ugadi. The new year is here, and so are 365 days of new dreams, fun, and frolic. The festival celebrated on the first day of “Chaitra” month brings with itself happiness and prosperity and much like spring, it makes way for new hopes. So, let us wear our brightest smiles and savour some sweet treats. With our arms wide open, let us embrace the year ahead and our chance to add new chapters to our lives.",
            "#Culture #HappyNewYear #FestivalsIndia #Traditions #Festivities #Celebrations #NewYearCelebrations",
            "Let us know how you are celebrating the day",
          ],
          [
            "3",
            "SM Banner`",
            "“It takes years to build reputation and only a few minutes of cyber attacks to ruin it”",
            "Together We Make the World Safer (Content: October is observed globally as National Cybersecurity Awareness Month. Since we all have transformed our lives digitally, it is in our best practices to safeguard ourselves against all types of data loss and theft. Confidentiality breeds integrity. In fact, at this crucial time, when almost 30,000 websites have already been hacked globally, maintaining confidentiality is of the utmost importance. The increase in sophisticated malware attacks and breached records across the world is necessitating the facilitation of cyber resilience. Fortunately, this can be achieved by web filtering tools, email security solutions, Identity and Acess Management (IAM), Security information and event management (SIEM), Penetration Testing, and more offered by cybersecurity service providers.",
            "#cyberthreats #cyberawareness #cyberattacks #cybersecurity #informationsecurity #networksecurity #dataprotection #cyberdefense #cyberresilience",
            "Give us a call to find more about this.",
          ],
          [
            "4",
            "SM Banner",
            "Easy-peasy policy claims processing",
            "Dear Insurers and Businesses, (Content: If you want to improve customer experiences, reduce discrepancies in the claims process, otherwise caused by manual data entry, enhance operational efficiency, and minimise operations costs, then Policy Checking Automation can be the answer to all your prayers. This technology trend can automate tasks such as the collection of client information, claim verification, and detection of fraudulent behaviours. Doing so would also improve your lead conversions since customers would not necessarily have to spend much time receiving evaluations or processing their claims. Simply put, this is a game-changing solution that can bear positive results for those who strive to sustain themselves in the current world of digital transformation.",
            "#policyenforcement #policyautomation #automationtools #policymanagement #policycomplaince",
            "Subscribe to our blog to see more.",
          ],
        ],
      ),
    ],
  },
];
