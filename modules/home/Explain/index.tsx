import React, { useRef } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useCounter } from 'react-use';
import { useInViewport } from 'ahooks';
import { usePlantList } from './plantConfig';
import PopCard from './PopCard';
import Plant from './Plant';
import Estrela from './Estrela';
import styles from './index.module.scss';

const SectionExplain = () => {
  const { t } = useTranslation();
  const plantList = usePlantList();
  const [value, { inc, reset, set }] = useCounter(
    plantList.length,
    plantList.length,
    0
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(sectionRef);
  return (
    <section>
      <div
        className={classnames(
          styles.bg,
          'relative h-[900px] w-full overflow-hidden'
        )}
      >
        <div className={classnames('h-full w-full')}>
          <div
            id="sectionexplain"
            ref={sectionRef}
            className={classnames(styles.constelacao, [
              inViewport ? styles.running : styles.paused,
            ])}
          >
            {Array.from({ length: 60 }, (v, k) => k).map((i) => (
              <Estrela key={i} />
            ))}
          </div>
          <div
            className={classnames(styles.plantBg, 'h-full w-full')}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                set(plantList.length);
              }
            }}
          >
            <div className="absolute top-1/2 left-1/2">
              <a
                href="/docs/metrics-models/robustness/"
                className={classnames(styles.title1)}
              ></a>
              <a
                href="/docs/category/productivity/"
                className={classnames(styles.title2)}
              ></a>
              <a
                href="/docs/metrics-models/niche-creation/"
                className={classnames(styles.title3)}
              ></a>
              {plantList.map(({ popContent, ...item }, i) => {
                return (
                  <Plant
                    key={i}
                    prop={item}
                    onMouseHover={() => {
                      set(i);
                    }}
                    className={classnames({ '!opacity-100': value == i })}
                  >
                    {value === i && (
                      <PopCard
                        className={classnames('left-[25px]', {
                          '-top-[145px]': item.bottom,
                          '-left-[245px]': item.right,
                        })}
                        popContent={popContent}
                        onNext={() => {
                          i === plantList.length - 1 ? reset() : inc();
                        }}
                      />
                    )}
                  </Plant>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={classnames(
            styles.working,
            'text-white md:px-2 md:text-3xl'
          )}
        >
          {t('home:oss_eco_evaluation_system')}
        </div>
      </div>
    </section>
  );
};

export default SectionExplain;
