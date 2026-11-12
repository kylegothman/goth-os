import '../svg.css';

/**
 * Dock icon for Yukon's Gold: a flat prospector swinging a pickaxe.
 * The arm + pick group (#yg-swing) rotates about the shoulder and the spark
 * flashes on impact — both driven by CSS in svg.css.
 */
export default function YukonsGold() {
  return (
    <div className="yukons-gold">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="22 -8 160 160">
        {/* ground, nugget and impact spark */}
        <line className="yg-cls-1" x1="36" y1="132" x2="152" y2="132" />
        <path className="yg-cls-2" d="M120 132 l5 -10 l11 -3 l8 7 l-3 6 z" />
        <g id="yg-spark" className="yg-cls-1">
          <line x1="126" y1="116" x2="122" y2="108" />
          <line x1="133" y1="113" x2="135" y2="104" />
          <line x1="141" y1="117" x2="149" y2="113" />
        </g>

        {/* legs and boots */}
        <line className="yg-cls-1" x1="72" y1="104" x2="67" y2="126" />
        <line className="yg-cls-1" x1="86" y1="104" x2="92" y2="126" />
        <path className="yg-cls-1" d="M58 132 h17 v-6 h-11 q-6 0 -6 6 z" />
        <path className="yg-cls-1" d="M86 132 h17 q0 -6 -6 -6 h-11 z" />

        {/* torso, belt, suspenders */}
        <path className="yg-cls-1" d="M64 74 h30 l4 30 h-38 z" />
        <line className="yg-cls-1" x1="60" y1="98" x2="98" y2="98" />
        <line className="yg-cls-1" x1="74" y1="74" x2="72" y2="98" />
        <line className="yg-cls-1" x1="84" y1="74" x2="86" y2="98" />

        {/* head, beard, eyes */}
        <circle className="yg-cls-1" cx="79" cy="50" r="13" />
        <path className="yg-cls-2" d="M67 54 Q79 76 91 54 Z" />
        <circle className="yg-cls-2" cx="74" cy="47" r="1.7" />
        <circle className="yg-cls-2" cx="84" cy="47" r="1.7" />

        {/* wide-brim hat */}
        <line className="yg-cls-1" x1="52" y1="38" x2="106" y2="38" />
        <path className="yg-cls-1" d="M64 38 l3 -17 q12 -5 24 0 l3 17 z" />
        <line className="yg-cls-1" x1="66" y1="33" x2="92" y2="33" />

        {/* arm + pickaxe, pivoting at the shoulder (92, 78) */}
        <g id="yg-swing">
          <line className="yg-cls-1" x1="92" y1="78" x2="116" y2="54" />
          <circle className="yg-cls-2" cx="116" cy="54" r="3" />
          <g transform="translate(116 54) rotate(-45)">
            <line className="yg-cls-3" x1="-10" y1="0" x2="36" y2="0" />
            <path className="yg-cls-2" d="M34 -22 Q47 0 34 22 L29 22 Q40 0 29 -22 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}
