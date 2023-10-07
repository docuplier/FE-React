import React from 'react';
import TruncateText from 'reusables/TruncateText';

export default {
  title: 'TruncateText',
  component: TruncateText,
};

let sampleText =
  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac vehicula magna. Nulla eget ex lobortis, facilisis dolor et, consectetur erat. Nunc eleifend mi non metus suscipit auctor. Etiam gravida ornare metus, nec ultricies lectus egestas sed. Fusce tincidunt, lorem a hendrerit tempus, ante velit dapibus dui, at sollicitudin lacus tortor vitae urna. Morbi at metus et nunc consequat feugiat vel a ex. Aenean egestas eros purus, non tempor erat mollis et. Donec vitae massa suscipit est tincidunt pulvinar a vel libero. Nulla lacus metus, ultrices vel justo quis, dictum mattis mauris. Sed ornare purus nunc, vel sagittis tellus finibus sit amet. Cras pulvinar sem sed risus suscipit, nec consectetur lectus sollicitudin. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer at tristique ligula.</p>';

export const TruncateTextStory = () => <TruncateText text={sampleText} lines={1} />;
