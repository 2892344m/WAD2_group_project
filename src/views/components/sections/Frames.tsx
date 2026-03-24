import type { Props } from 'daisy-jsx';

// Renamed type to be more descriptive and use 'class' instead of 'className'
type FrameProps = Props & {
  heading: string;
  topOffset: string;
  frameStyle?: string;
};

export function maxLength(string: string, length: number) {
  if (string === null) return '';

  try {
    if (string.length >= length) {
      return string.substring(0, 120) + '...';
    } else {
      return string;
    }
  } catch (error) {
    return '';
  }
}

export const Frame = ({
  children,
  heading,
  topOffset,
  class: className, // Accepts 'class' from parent but keeps 'className' as internal variable
}: FrameProps) => (
  <div
    class={`${className || ''} w-full flex flex-col h-fit pl-[6%] pr-[6%] pt-12 pb-12 relative my-auto -md:px-0`}
    style={`top: ${topOffset}px;`} // FIX: Used standard style string for dynamic values to ensure reliability
  >
    <div class="max-w-[1170px] w-full ml-auto mr-auto flex flex-col flex-wrap justify-between">
      <h2 class="text-2xl ml-[-40px] mb-6 text-left tracking-[1px] uppercase heading-font -xl:w-full -xl:ml-0 -xl:text-center">
        {heading}
      </h2>
      {children}
    </div>
  </div>
);

export const MosaicFrame = ({
  children,
  heading,
  topOffset,
  frameStyle,
}: FrameProps) => (
  <Frame heading={heading} topOffset={topOffset} class={frameStyle}>
    <div class="max-w-[1170px] ml-auto mr-auto flex flex-row flex-wrap justify-between card-container">
      {children}
    </div>
  </Frame>
);

export const PostFrame = ({
  children,
  heading,
  topOffset,
  frameStyle,
}: FrameProps) => (
  <Frame heading={heading} topOffset={topOffset} class={frameStyle}>
    <div class="flex flex-wrap relative justify-around -md:mx-[10px] gap-6">{children}</div>
  </Frame>
);

export const PostFrameHor = ({
  children,
  heading,
  topOffset,
  frameStyle,
}: FrameProps) => (
  <Frame heading={heading} topOffset={topOffset} class={frameStyle}>
    <div class="flex flex-wrap justify-between -md:mx-[10px] gap-4">{children}</div>
  </Frame>
);