import Category from "@/models/Category";
import LibraryIdea from "@/models/LibraryIdea";

/**
 * Seeds the database with categories and 100+ library ideas
 */
export async function seedLibraryIdeas() {
  console.log("\n📚 Seeding library categories and ideas...");

  try {
    // Clear existing data
    await Category.deleteMany({});
    await LibraryIdea.deleteMany({});

    // Create categories
    const categories = await Category.create([
      { name: "Travel & Adventure", slug: "travel-adventure", order: 1},
      { name: "Learning & Skills", slug: "learning-skills", order: 2},
      { name: "Health & Fitness", slug: "health-fitness", order: 3 },
      { name: "Creative & Arts", slug: "creative-arts", order: 4 },
      { name: "Experiences & Events", slug: "experiences-events", order: 5 },
    ]);

    console.log(`✓ Created ${categories.length} categories`);

    // Create library ideas
    const ideas = [
      // Travel & Adventure
      { title: "Visit the Grand Canyon", categoryId: categories[0]._id, tags: ["nature", "usa", "hiking"] },
      { title: "See the Northern Lights in Iceland", categoryId: categories[0]._id, tags: ["nature", "iceland", "winter"] },
      { title: "Hike Machu Picchu in Peru", categoryId: categories[0]._id, tags: ["hiking", "peru", "history"] },
      { title: "Go on an African Safari", categoryId: categories[0]._id, tags: ["wildlife", "africa", "adventure"] },
      { title: "Visit the Eiffel Tower in Paris", categoryId: categories[0]._id, tags: ["france", "landmark", "europe"] },
      { title: "Explore the Great Wall of China", categoryId: categories[0]._id, tags: ["china", "history", "hiking"] },
      { title: "Scuba dive in the Great Barrier Reef", categoryId: categories[0]._id, tags: ["diving", "australia", "ocean"] },
      { title: "Road trip across Route 66", categoryId: categories[0]._id, tags: ["usa", "roadtrip", "adventure"] },
      { title: "Visit all 7 continents", categoryId: categories[0]._id, tags: ["travel", "adventure", "global"] },
      { title: "Go skydiving", categoryId: categories[0]._id, tags: ["extreme", "adventure", "flying"] },
      { title: "Take a hot air balloon ride in Cappadocia", categoryId: categories[0]._id, tags: ["turkey", "flying", "scenic"] },
      { title: "Visit Petra in Jordan", categoryId: categories[0]._id, tags: ["history", "jordan", "unesco"] },
      { title: "Explore the Amazon Rainforest", categoryId: categories[0]._id, tags: ["nature", "brazil", "adventure"] },
      { title: "See the Taj Mahal at sunrise", categoryId: categories[0]._id, tags: ["india", "landmark", "history"] },
      { title: "Go whale watching in Alaska", categoryId: categories[0]._id, tags: ["wildlife", "usa", "ocean"] },
      { title: "Visit Angkor Wat in Cambodia", categoryId: categories[0]._id, tags: ["history", "cambodia", "unesco"] },
      { title: "Take a gondola ride in Venice", categoryId: categories[0]._id, tags: ["italy", "romantic", "water"] },
      { title: "Hike to Everest Base Camp", categoryId: categories[0]._id, tags: ["nepal", "hiking", "extreme"] },
      { title: "See the cherry blossoms in Japan", categoryId: categories[0]._id, tags: ["japan", "nature", "spring"] },
      { title: "Visit Santorini, Greece", categoryId: categories[0]._id, tags: ["greece", "islands", "scenic"] },

      // Learning & Skills
      { title: "Learn to play guitar", categoryId: categories[1]._id, tags: ["music", "instrument", "hobby"] },
      { title: "Become fluent in a foreign language", categoryId: categories[1]._id, tags: ["language", "education", "communication"] },
      { title: "Learn to code", categoryId: categories[1]._id, tags: ["tech", "career", "programming"] },
      { title: "Take a cooking class", categoryId: categories[1]._id, tags: ["food", "cooking", "skill"] },
      { title: "Learn photography basics", categoryId: categories[1]._id, tags: ["art", "photography", "skill"] },
      { title: "Master public speaking", categoryId: categories[1]._id, tags: ["communication", "confidence", "skill"] },
      { title: "Get a professional certification", categoryId: categories[1]._id, tags: ["career", "education", "professional"] },
      { title: "Read 100 books in a year", categoryId: categories[1]._id, tags: ["reading", "education", "challenge"] },
      { title: "Learn to play chess", categoryId: categories[1]._id, tags: ["strategy", "game", "mental"] },
      { title: "Take a wine tasting course", categoryId: categories[1]._id, tags: ["wine", "education", "food"] },
      { title: "Learn sign language", categoryId: categories[1]._id, tags: ["language", "communication", "skill"] },
      { title: "Complete an online degree", categoryId: categories[1]._id, tags: ["education", "career", "degree"] },
      { title: "Learn to meditate", categoryId: categories[1]._id, tags: ["mindfulness", "wellness", "mental health"] },
      { title: "Take a photography workshop", categoryId: categories[1]._id, tags: ["art", "photography", "workshop"] },
      { title: "Learn basic car maintenance", categoryId: categories[1]._id, tags: ["practical", "skill", "automotive"] },
      { title: "Master a magic trick", categoryId: categories[1]._id, tags: ["entertainment", "skill", "performance"] },
      { title: "Learn to dance salsa", categoryId: categories[1]._id, tags: ["dance", "social", "fitness"] },
      { title: "Study astronomy", categoryId: categories[1]._id, tags: ["science", "space", "education"] },
      { title: "Learn calligraphy", categoryId: categories[1]._id, tags: ["art", "writing", "skill"] },
      { title: "Take an acting class", categoryId: categories[1]._id, tags: ["performance", "art", "confidence"] },

      // Health & Fitness
      { title: "Run a marathon", categoryId: categories[2]._id, tags: ["running", "fitness", "endurance"] },
      { title: "Complete a triathlon", categoryId: categories[2]._id, tags: ["swimming", "cycling", "running"] },
      { title: "Learn to surf", categoryId: categories[2]._id, tags: ["water sports", "beach", "adventure"] },
      { title: "Do 100 pushups in a row", categoryId: categories[2]._id, tags: ["strength", "fitness", "challenge"] },
      { title: "Climb a mountain", categoryId: categories[2]._id, tags: ["hiking", "adventure", "outdoor"] },
      { title: "Practice yoga for 30 days straight", categoryId: categories[2]._id, tags: ["yoga", "flexibility", "wellness"] },
      { title: "Go rock climbing", categoryId: categories[2]._id, tags: ["climbing", "strength", "adventure"] },
      { title: "Complete a CrossFit workout", categoryId: categories[2]._id, tags: ["fitness", "strength", "endurance"] },
      { title: "Learn to swim properly", categoryId: categories[2]._id, tags: ["swimming", "water", "skill"] },
      { title: "Try indoor skydiving", categoryId: categories[2]._id, tags: ["adventure", "flying", "extreme"] },
      { title: "Complete a 30-day fitness challenge", categoryId: categories[2]._id, tags: ["fitness", "challenge", "discipline"] },
      { title: "Go mountain biking", categoryId: categories[2]._id, tags: ["cycling", "outdoor", "adventure"] },
      { title: "Learn martial arts", categoryId: categories[2]._id, tags: ["martial arts", "discipline", "fitness"] },
      { title: "Do a handstand", categoryId: categories[2]._id, tags: ["gymnastics", "strength", "skill"] },
      { title: "Go white water rafting", categoryId: categories[2]._id, tags: ["water sports", "adventure", "teamwork"] },
      { title: "Complete a Spartan Race", categoryId: categories[2]._id, tags: ["obstacle course", "fitness", "challenge"] },
      { title: "Learn to paddleboard", categoryId: categories[2]._id, tags: ["water sports", "balance", "outdoor"] },
      { title: "Go bungee jumping", categoryId: categories[2]._id, tags: ["extreme", "adventure", "thrill"] },
      { title: "Complete a 10K run", categoryId: categories[2]._id, tags: ["running", "fitness", "endurance"] },
      { title: "Try aerial yoga", categoryId: categories[2]._id, tags: ["yoga", "unique", "fitness"] },

      // Creative & Arts
      { title: "Write a novel", categoryId: categories[3]._id, tags: ["writing", "creativity", "literature"] },
      { title: "Paint a self-portrait", categoryId: categories[3]._id, tags: ["painting", "art", "creativity"] },
      { title: "Learn pottery", categoryId: categories[3]._id, tags: ["ceramics", "art", "craft"] },
      { title: "Create a photo album", categoryId: categories[3]._id, tags: ["photography", "memories", "creativity"] },
      { title: "Write and record a song", categoryId: categories[3]._id, tags: ["music", "creativity", "recording"] },
      { title: "Start a blog or vlog", categoryId: categories[3]._id, tags: ["writing", "content", "online"] },
      { title: "Learn to knit or crochet", categoryId: categories[3]._id, tags: ["crafts", "handmade", "skill"] },
      { title: "Create a piece of furniture", categoryId: categories[3]._id, tags: ["woodworking", "craft", "diy"] },
      { title: "Take a drawing class", categoryId: categories[3]._id, tags: ["drawing", "art", "skill"] },
      { title: "Design your own clothing", categoryId: categories[3]._id, tags: ["fashion", "design", "creativity"] },
      { title: "Make a short film", categoryId: categories[3]._id, tags: ["film", "video", "storytelling"] },
      { title: "Learn digital illustration", categoryId: categories[3]._id, tags: ["art", "digital", "design"] },
      { title: "Create a sculpture", categoryId: categories[3]._id, tags: ["sculpture", "art", "3d"] },
      { title: "Publish a poem", categoryId: categories[3]._id, tags: ["poetry", "writing", "publication"] },
      { title: "Make homemade soap or candles", categoryId: categories[3]._id, tags: ["crafts", "diy", "homemade"] },
      { title: "Design a website from scratch", categoryId: categories[3]._id, tags: ["web design", "tech", "creativity"] },
      { title: "Create a comic book", categoryId: categories[3]._id, tags: ["comics", "art", "storytelling"] },
      { title: "Build a model ship or airplane", categoryId: categories[3]._id, tags: ["models", "craft", "patience"] },
      { title: "Write a screenplay", categoryId: categories[3]._id, tags: ["writing", "film", "storytelling"] },
      { title: "Learn origami", categoryId: categories[3]._id, tags: ["paper craft", "art", "japanese"] },

      // Experiences & Events
      { title: "Attend a music festival", categoryId: categories[4]._id, tags: ["music", "festival", "social"] },
      { title: "Go to a Broadway show", categoryId: categories[4]._id, tags: ["theater", "performance", "nyc"] },
      { title: "See a rocket launch", categoryId: categories[4]._id, tags: ["space", "science", "event"] },
      { title: "Attend the Olympics", categoryId: categories[4]._id, tags: ["sports", "event", "international"] },
      { title: "Go to a Comic-Con", categoryId: categories[4]._id, tags: ["comics", "convention", "pop culture"] },
      { title: "See a solar eclipse", categoryId: categories[4]._id, tags: ["astronomy", "nature", "rare"] },
      { title: "Attend a TED Talk", categoryId: categories[4]._id, tags: ["education", "inspiration", "event"] },
      { title: "Go to a professional sports game", categoryId: categories[4]._id, tags: ["sports", "event", "social"] },
      { title: "Visit a wine vineyard", categoryId: categories[4]._id, tags: ["wine", "travel", "food"] },
      { title: "Attend a cooking demonstration by a celebrity chef", categoryId: categories[4]._id, tags: ["food", "cooking", "event"] },
      { title: "Go to a midnight movie premiere", categoryId: categories[4]._id, tags: ["movies", "event", "pop culture"] },
      { title: "Attend a masquerade ball", categoryId: categories[4]._id, tags: ["formal", "social", "costume"] },
      { title: "See the ball drop on New Year's Eve in Times Square", categoryId: categories[4]._id, tags: ["celebration", "nyc", "tradition"] },
      { title: "Go to a renaissance fair", categoryId: categories[4]._id, tags: ["history", "festival", "costume"] },
      { title: "Attend a silent disco", categoryId: categories[4]._id, tags: ["music", "dance", "unique"] },
      { title: "See a meteor shower", categoryId: categories[4]._id, tags: ["astronomy", "nature", "night"] },
      { title: "Go to a drive-in movie theater", categoryId: categories[4]._id, tags: ["movies", "retro", "nostalgia"] },
      { title: "Attend a food truck festival", categoryId: categories[4]._id, tags: ["food", "festival", "culinary"] },
      { title: "Go to an escape room", categoryId: categories[4]._id, tags: ["puzzle", "teamwork", "challenge"] },
      { title: "Attend a murder mystery dinner", categoryId: categories[4]._id, tags: ["theater", "food", "interactive"] },
    ];

    const createdIdeas = await LibraryIdea.create(ideas);
    console.log(`✓ Created ${createdIdeas.length} library ideas`);

    console.log("✓ Library seed completed successfully");
  } catch (error) {
    console.error("✗ Library seed failed:", error);
    throw error;
  }
}
