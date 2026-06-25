import { useEffect, useRef, memo } from 'react';
import { useAnimations } from '../../hooks/useAnimations';
import { timelineItems } from '../../data/experienceData';


const TimelineMarker = memo(({ icon: Icon }) => (
  <div className="flex flex-col items-center">
    <div className="timeline-marker w-12 h-12 md:w-16 md:h-16 rounded-full bg-black border border-white/20 flex items-center justify-center z-20 relative shadow-[0_0_20px_rgba(255,255,255,0.15)] opacity-0 scale-0">
      <span className="text-white text-lg md:text-2xl"><Icon /></span>
    </div>
  </div>
));
TimelineMarker.displayName = 'TimelineMarker';


const TimelineContent = memo(({ title, organization, period, description, certificateLink }) => (
  <div className="timeline-content glass-panel relative p-6 md:p-8 rounded-3xl overflow-hidden group opacity-0 translate-y-[30px] border border-white/10 hover:border-white/20 transition-colors duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    <div className="flex flex-col gap-4 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-white uppercase border border-white/20 rounded-full bg-white/5 w-fit">
          {period}
        </span>
        {certificateLink && (
          <a 
            href={certificateLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-4"
            aria-label={`View certificate for ${title} at ${organization}`}
          >
            View Certificate
          </a>
        )}
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1 font-heading loading-tight">{title}</h3>
        <p className="text-base md:text-lg text-gray-400 font-light">{organization}</p>
      </div>
      <p className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4">
        {description}
      </p>
    </div>
  </div>
));
TimelineContent.displayName = 'TimelineContent';


const TimelineItem = ({ item, index }) => {
  const isEven = index % 2 === 0;
  return (
    <div className={`timeline-item relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className="hidden md:block md:w-1/2" />
      <div className="absolute -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 flex justify-center">
        <TimelineMarker icon={item.icon} />
      </div>
      <div className={`pl-14 md:pl-0 w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
        <TimelineContent {...item} />
      </div>
    </div>
  );
};


const Experience = () => {
  const sectionRef = useRef(null);

  const { animateExperience } = useAnimations();
  useEffect(() => {
    const cleanup = animateExperience(sectionRef);
    return cleanup;
  }, [animateExperience]);

  return (
    <section id="experience" className="py-24 relative overflow-hidden section-lazy" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="exp-header text-center mb-16">
          <h2 className="glass-heading text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight text-white">
            Experience
          </h2>
        </div>

        {/* Vertical spine line */}
        <div className="absolute left-6 md:left-1/2 top-[200px] bottom-24 w-px bg-white/5 md:-translate-x-1/2" />
        <div className="timeline-spine absolute left-6 md:left-1/2 top-[200px] bottom-24 w-px bg-gradient-to-b from-white via-white/50 to-transparent md:-translate-x-1/2 origin-top" />

        <div className="space-y-12">
          {timelineItems.map((item, index) => (
            <TimelineItem 
              key={index} 
              item={item} 
              index={index} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};


export default memo(Experience);
