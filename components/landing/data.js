import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
  PhotoIcon,                // biểu tượng chụp ảnh
  SparklesIcon,             // biểu tượng học sinh vui vẻ / tương tác
  AdjustmentsVerticalIcon   // biểu tượng gợi ý cá nhân hóa
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "Empower Kids to Learn English Smarter",
  desc: "Snap a photo and let AI help children learn English vocabulary in a fun and effective way.",
  image: benefitOneImg,
  bullets: [
    {
      title: "An easy way for children to learn new vocabulary",
      desc: "Children can take photos and instantly learn words through real-life objects.",
      icon: <PhotoIcon />,
    },
    {
      title: "Interactive and engaging learning experience",
      desc: "Fun activities and AI interaction make learning exciting and effective.",
      icon: <SparklesIcon />,
    },
    {
      title: "Personalized suggestions based on images",
      desc: "AI recommends vocabulary tailored to each image your child captures.",
      icon: <AdjustmentsVerticalIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Track, Practice and Grow",
  desc: "SnapLearn lets students track their progress and practice quizzes tailored to their learning path. Teachers and Parents can follow up easily.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Progress Tracking",
      desc: "Students can monitor their milestones, view mistakes, and review completed tasks anytime.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Smart Quiz Suggestions",
      desc: "AI recommends personalized quizzes based on student’s learning performance and recent activities.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Parent & Teacher Dashboard",
      desc: "Educators and parents can follow progress and assign suitable tasks to support learning. ",
      icon: <SunIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
