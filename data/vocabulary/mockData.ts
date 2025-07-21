import { Category } from "@/types/vocabulary";

export const mockVocabularyData: Category[] = [
  {
    id: "work",
    name: "Work & Professions",
    description: "Learn vocabulary related to work and different professions",
    color: "bg-blue-500",
    icon: "💼",
    isLocked: false,
    order: 1,
    topics: [
      {
        id: "professions",
        name: "Common Professions",
        description: "Basic job titles and professions",
        isLocked: false,
        order: 1,
        progress: 0,
        vocabulary: [
          {
            id: "doctor",
            word: "Doctor",
            meaning: "Bác sĩ",
            example: "The doctor examined the patient carefully.",
            pronunciation: "/ˈdɒktər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "teacher",
            word: "Teacher",
            meaning: "Giáo viên",
            example: "The teacher explained the lesson clearly.",
            pronunciation: "/ˈtiːtʃər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "engineer",
            word: "Engineer",
            meaning: "Kỹ sư",
            example: "The engineer designed a new bridge.",
            pronunciation: "/ˌendʒɪˈnɪər/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "lawyer",
            word: "Lawyer",
            meaning: "Luật sư",
            example: "The lawyer defended his client in court.",
            pronunciation: "/ˈlɔːjər/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "nurse",
            word: "Nurse",
            meaning: "Y tá",
            example: "The nurse took care of the patients.",
            pronunciation: "/nɜːrs/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "manager",
            word: "Manager",
            meaning: "Quản lý",
            example: "The manager organized the team meeting.",
            pronunciation: "/ˈmænɪdʒər/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "accountant",
            word: "Accountant",
            meaning: "Kế toán",
            example: "The accountant calculated the company's profits.",
            pronunciation: "/əˈkaʊntənt/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "chef",
            word: "Chef",
            meaning: "Đầu bếp",
            example: "The chef prepared a delicious meal.",
            pronunciation: "/ʃef/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "architect",
            word: "Architect",
            meaning: "Kiến trúc sư",
            example: "The architect designed a modern building.",
            pronunciation: "/ˈɑːrkɪtekt/",
            isKnown: false,
            difficulty: "hard"
          }
        ]
      },
      {
        id: "office-work",
        name: "Office Work",
        description: "Vocabulary related to office environment",
        isLocked: false,
        order: 2,
        progress: 0,
        vocabulary: [
          {
            id: "meeting",
            word: "Meeting",
            meaning: "Cuộc họp",
            example: "We have a meeting at 3 PM.",
            pronunciation: "/ˈmiːtɪŋ/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "presentation",
            word: "Presentation",
            meaning: "Bài thuyết trình",
            example: "She gave an excellent presentation.",
            pronunciation: "/ˌprezənˈteɪʃən/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "deadline",
            word: "Deadline",
            meaning: "Hạn chót",
            example: "The project deadline is next Friday.",
            pronunciation: "/ˈdedlaɪn/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "computer",
            word: "Computer",
            meaning: "Máy tính",
            example: "I use my computer for work every day.",
            pronunciation: "/kəmˈpjuːtər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "email",
            word: "Email",
            meaning: "Thư điện tử",
            example: "Please send me an email with the details.",
            pronunciation: "/ˈiːmeɪl/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "schedule",
            word: "Schedule",
            meaning: "Lịch trình",
            example: "Let me check my schedule for tomorrow.",
            pronunciation: "/ˈʃedjuːl/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "colleague",
            word: "Colleague",
            meaning: "Đồng nghiệp",
            example: "My colleague helped me with the project.",
            pronunciation: "/ˈkɒliːɡ/",
            isKnown: false,
            difficulty: "medium"
          }
        ]
      }
    ]
  },
  {
    id: "education",
    name: "Education & Learning",
    description: "Academic vocabulary and school-related terms",
    color: "bg-green-500",
    icon: "📚",
    isLocked: false,
    order: 2,
    topics: [
      {
        id: "school-subjects",
        name: "School Subjects",
        description: "Different academic subjects",
        isLocked: false,
        order: 1,
        progress: 0,
        vocabulary: [
          {
            id: "mathematics",
            word: "Mathematics",
            meaning: "Toán học",
            example: "Mathematics is my favorite subject.",
            pronunciation: "/ˌmæθəˈmætɪks/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "science",
            word: "Science",
            meaning: "Khoa học",
            example: "We conducted an experiment in science class.",
            pronunciation: "/ˈsaɪəns/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "history",
            word: "History",
            meaning: "Lịch sử",
            example: "History teaches us about the past.",
            pronunciation: "/ˈhɪstəri/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "geography",
            word: "Geography",
            meaning: "Địa lý",
            example: "We studied world geography in class.",
            pronunciation: "/dʒiˈɒɡrəfi/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "literature",
            word: "Literature",
            meaning: "Văn học",
            example: "English literature is fascinating.",
            pronunciation: "/ˈlɪtərətʃər/",
            isKnown: false,
            difficulty: "hard"
          },
          {
            id: "physics",
            word: "Physics",
            meaning: "Vật lý",
            example: "Physics explains how the world works.",
            pronunciation: "/ˈfɪzɪks/",
            isKnown: false,
            difficulty: "hard"
          },
          {
            id: "chemistry",
            word: "Chemistry",
            meaning: "Hóa học",
            example: "We did experiments in chemistry lab.",
            pronunciation: "/ˈkemɪstri/",
            isKnown: false,
            difficulty: "hard"
          }
        ]
      },
      {
        id: "classroom",
        name: "Classroom Items",
        description: "Things you find in a classroom",
        isLocked: false,
        order: 2,
        progress: 0,
        vocabulary: [
          {
            id: "blackboard",
            word: "Blackboard",
            meaning: "Bảng đen",
            example: "The teacher wrote on the blackboard.",
            pronunciation: "/ˈblækbɔːrd/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "desk",
            word: "Desk",
            meaning: "Bàn học",
            example: "Each student has their own desk.",
            pronunciation: "/desk/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "notebook",
            word: "Notebook",
            meaning: "Vở ghi chép",
            example: "I write notes in my notebook.",
            pronunciation: "/ˈnoʊtbʊk/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "pencil",
            word: "Pencil",
            meaning: "Bút chì",
            example: "Please use a pencil for the test.",
            pronunciation: "/ˈpensəl/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "eraser",
            word: "Eraser",
            meaning: "Tẩy",
            example: "I need an eraser to fix my mistake.",
            pronunciation: "/ɪˈreɪsər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "calculator",
            word: "Calculator",
            meaning: "Máy tính",
            example: "Use a calculator for math problems.",
            pronunciation: "/ˈkælkjəleɪtər/",
            isKnown: false,
            difficulty: "medium"
          }
        ]
      }
    ]
  },
  {
    id: "daily-life",
    name: "Daily Life",
    description: "Everyday vocabulary for common situations",
    color: "bg-purple-500",
    icon: "🏠",
    isLocked: false,
    order: 3,
    topics: [
      {
        id: "family",
        name: "Family Members",
        description: "Words for family relationships",
        isLocked: false,
        order: 1,
        progress: 0,
        vocabulary: [
          {
            id: "mother",
            word: "Mother",
            meaning: "Mẹ",
            example: "My mother cooks delicious meals.",
            pronunciation: "/ˈmʌðər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "father",
            word: "Father",
            meaning: "Cha",
            example: "My father goes to work every morning.",
            pronunciation: "/ˈfɑːðər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "sister",
            word: "Sister",
            meaning: "Chị/Em gái",
            example: "My sister is studying at university.",
            pronunciation: "/ˈsɪstər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "brother",
            word: "Brother",
            meaning: "Anh/Em trai",
            example: "My brother plays football every weekend.",
            pronunciation: "/ˈbrʌðər/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "grandmother",
            word: "Grandmother",
            meaning: "Bà",
            example: "My grandmother tells wonderful stories.",
            pronunciation: "/ˈɡrænmʌðər/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "grandfather",
            word: "Grandfather",
            meaning: "Ông",
            example: "My grandfather worked as a farmer.",
            pronunciation: "/ˈɡrænfɑːðər/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "aunt",
            word: "Aunt",
            meaning: "Cô/Dì",
            example: "My aunt lives in another city.",
            pronunciation: "/ænt/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "uncle",
            word: "Uncle",
            meaning: "Chú/Bác",
            example: "My uncle is a doctor.",
            pronunciation: "/ˈʌŋkəl/",
            isKnown: false,
            difficulty: "medium"
          }
        ]
      },
      {
        id: "household-items",
        name: "Household Items",
        description: "Common items found in the house",
        isLocked: false,
        order: 2,
        progress: 0,
        vocabulary: [
          {
            id: "kitchen",
            word: "Kitchen",
            meaning: "Nhà bếp",
            example: "We cook meals in the kitchen.",
            pronunciation: "/ˈkɪtʃən/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "bedroom",
            word: "Bedroom",
            meaning: "Phòng ngủ",
            example: "I sleep in my bedroom.",
            pronunciation: "/ˈbedrʊm/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "bathroom",
            word: "Bathroom",
            meaning: "Phòng tắm",
            example: "The bathroom is upstairs.",
            pronunciation: "/ˈbæθrʊm/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "refrigerator",
            word: "Refrigerator",
            meaning: "Tủ lạnh",
            example: "Keep the milk in the refrigerator.",
            pronunciation: "/rɪˈfrɪdʒəreɪtər/",
            isKnown: false,
            difficulty: "hard"
          },
          {
            id: "television",
            word: "Television",
            meaning: "Ti vi",
            example: "We watch news on television.",
            pronunciation: "/ˈtelɪvɪʒən/",
            isKnown: false,
            difficulty: "medium"
          }
        ]
      }
    ]
  },
  {
    id: "food-drink",
    name: "Food & Drink",
    description: "Vocabulary for meals, restaurants, and beverages",
    color: "bg-orange-500",
    icon: "🍔",
    isLocked: true,
    order: 4,
    topics: [
      {
        id: "ordering-food",
        name: "Ordering Food",
        description: "How to order food at restaurants",
        isLocked: false,
        order: 1,
        progress: 0,
        vocabulary: [
          {
            id: "menu",
            word: "Menu",
            meaning: "Thực đơn",
            example: "Can I see the menu, please?",
            pronunciation: "/ˈmenjuː/",
            isKnown: false,
            difficulty: "easy"
          }
        ]
      }
    ]
  },
  {
    id: "travel",
    name: "Travel & Transportation",
    description: "Vocabulary for traveling and getting around",
    color: "bg-cyan-500",
    icon: "✈️",
    isLocked: false,
    order: 5,
    topics: [
      {
        id: "transportation",
        name: "Transportation",
        description: "Different ways to travel",
        isLocked: false,
        order: 1,
        progress: 0,
        vocabulary: [
          {
            id: "airplane",
            word: "Airplane",
            meaning: "Máy bay",
            example: "The airplane takes off at 6 PM.",
            pronunciation: "/ˈerpleɪn/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "train",
            word: "Train",
            meaning: "Tàu hỏa",
            example: "I take the train to work every day.",
            pronunciation: "/treɪn/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "bus",
            word: "Bus",
            meaning: "Xe buýt",
            example: "The bus arrives at 8 AM.",
            pronunciation: "/bʌs/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "taxi",
            word: "Taxi",
            meaning: "Taxi",
            example: "Let's take a taxi to the airport.",
            pronunciation: "/ˈtæksi/",
            isKnown: false,
            difficulty: "easy"
          },
          {
            id: "bicycle",
            word: "Bicycle",
            meaning: "Xe đạp",
            example: "I ride my bicycle to school.",
            pronunciation: "/ˈbaɪsɪkəl/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "motorcycle",
            word: "Motorcycle",
            meaning: "Xe máy",
            example: "He drives a motorcycle to work.",
            pronunciation: "/ˈmoʊtərsaɪkəl/",
            isKnown: false,
            difficulty: "medium"
          }
        ]
      },
      {
        id: "at-airport",
        name: "At the Airport",
        description: "Vocabulary for airport and flight situations",
        isLocked: false,
        order: 2,
        progress: 0,
        vocabulary: [
          {
            id: "passport",
            word: "Passport",
            meaning: "Hộ chiếu",
            example: "Don't forget to bring your passport.",
            pronunciation: "/ˈpæspɔːrt/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "boarding-pass",
            word: "Boarding Pass",
            meaning: "Thẻ lên máy bay",
            example: "Please show your boarding pass.",
            pronunciation: "/ˈbɔːrdɪŋ pæs/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "luggage",
            word: "Luggage",
            meaning: "Hành lý",
            example: "Where can I pick up my luggage?",
            pronunciation: "/ˈlʌɡɪdʒ/",
            isKnown: false,
            difficulty: "medium"
          },
          {
            id: "departure",
            word: "Departure",
            meaning: "Khởi hành",
            example: "The departure time is 3:30 PM.",
            pronunciation: "/dɪˈpɑːrtʃər/",
            isKnown: false,
            difficulty: "hard"
          },
          {
            id: "arrival",
            word: "Arrival",
            meaning: "Đến nơi",
            example: "The arrival gate is B12.",
            pronunciation: "/əˈraɪvəl/",
            isKnown: false,
            difficulty: "medium"
          }
        ]
      }
    ]
  }
];
