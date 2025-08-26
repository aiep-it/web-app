import Image from "next/image";
import React from "react";
import { Container } from "@/components/landing/Container";

import userOneImg from "../../public/img/user1.jpg";
import userTwoImg from "../../public/img/user2.jpg";
import userThreeImg from "../../public/img/user3.jpg";

export const Testimonials = () => {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        {/* Testimonial 1 */}
        <TestimonialCard
          message="SnapLearn has made learning new words fun and engaging for my students."
          image={userOneImg}
          name="Sarah Johnson"
          title="Primary School Teacher"
        />

        {/* Testimonial 2 */}
        <TestimonialCard
          message="My daughter loves SnapLearn! It's a fantastic tool for building her English skills."
          image={userTwoImg}
          name="Mark Davis"
          title="Parent of Grade 5 Student"
        />

        {/* Testimonial 3 */}
        <TestimonialCard
          message="The AI features in SnapLearn are truly impressive."
          image={userThreeImg}
          name="Emily Wilson"
          title="Elementary Teacher"
        />
      </div>
    </Container>
  );
};

interface TestimonialCardProps {
  message: string;
  image: any;
  name: string;
  title: string;
}

function TestimonialCard({ message, image, name, title }: Readonly<TestimonialCardProps>) {
  return (
    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 py-12 rounded-2xl dark:bg-trueGray-800">
      <p className="text-2xl leading-normal text-gray-800 dark:text-white">
        {message}
      </p>
      <div className="mt-6 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <Avatar image={image} name={name} title={title} />
    </div>
  );
}

interface AvatarProps {
  image: any;
  name: string;
  title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
  return (
    <div className="flex items-center mt-6 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
        <Image
          src={props.image}
          width={56}
          height={56}
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium text-gray-900 dark:text-white">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      className="w-5 h-5 text-yellow-500 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M10 15l-5.878 3.09L5.64 12.5 1 8.91l6.06-.88L10 3l2.94 5.03 6.06.88-4.64 3.59 1.518 5.59z" />
    </svg>
  );
}