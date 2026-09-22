export default function AboutPattern() {
  return (
    <svg
      className="about-pattern"
      viewBox="0 0 180 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        {/* TOP CUBE */}
        <path d="M55 0 L105 29 L105 87 L55 116 L5 87 L5 29 Z" />
        <path d="M55 0 V58" />
        <path d="M5 29 L55 58 L105 29" />

        {/* upper-right continuation */}
        <path d="M105 29 L155 0" />
        <path d="M105 87 L155 116" />
        <path d="M155 0 V58" />
        <path d="M155 58 L105 87" />

        {/* SECOND CUBE */}
        <path d="M105 145 L155 174 L155 232 L105 261 L55 232 L55 174 Z" />
        <path d="M105 145 V203" />
        <path d="M55 174 L105 203 L155 174" />

        {/* connection */}
        <path d="M105 87 V145" />

        {/* THIRD / LEFT-EXTENDING CUBE */}
        <path d="M55 290 L105 319 L105 377 L55 406 L5 377 L5 319 Z" />
        <path d="M55 290 V348" />
        <path d="M5 319 L55 348 L105 319" />

        <path d="M105 261 V319" />

        {/* FOURTH CUBE */}
        <path d="M105 435 L155 464 L155 522 L105 551 L55 522 L55 464 Z" />
        <path d="M105 435 V493" />
        <path d="M55 464 L105 493 L155 464" />

        <path d="M105 377 V435" />

        {/* FIFTH CUBE */}
        <path d="M105 580 L155 609 L155 667 L105 696 L55 667 L55 609 Z" />
        <path d="M105 580 V638" />
        <path d="M55 609 L105 638 L155 609" />

        <path d="M105 551 V580" />

        {/* LOWER OFFSET CUBE */}
        <path d="M55 725 L105 754 L105 812 L55 841 L5 812 L5 754 Z" />
        <path d="M55 725 V783" />
        <path d="M5 754 L55 783 L105 754" />

        <path d="M105 696 V754" />

        {/* bottom continuation */}
        <path d="M55 841 V900" />
        <path d="M105 812 L155 841" />
      </g>
    </svg>
  );
}