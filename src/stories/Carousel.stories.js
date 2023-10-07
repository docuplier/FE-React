import React from 'react';
import Carousel from 'reusables/Carousel';
import CourseProgressCard from 'reusables/CourseProgressCard';
import { courses } from 'pages/Users/mockData';

export default {
  title: 'carousel',
  component: Carousel,
};

export const carousel = () => (
  <Carousel
    items={courses?.map((course, index) => (
      <div style={{ margin: `0 10px` }}>
        <CourseProgressCard
          key={index}
          title={course.title}
          description={course.desc}
          imageSrc={course.image}
          progress={course.progress}
          chipProp={{
            label: course.status,
            color: course.status === 'Enrolled' ? 'success' : 'warning',
          }}
        />
      </div>
    ))}
    mouseTracking
  />
);
