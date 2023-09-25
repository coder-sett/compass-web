import React, { RefObject, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames';
import { Portal } from '@mui/base/Portal';
import qrcode from 'qrcode';
import { getProvider, sleep } from '@common/utils';
import { Level } from '@modules/analyze/constant';
import useCompareItems from '@modules/analyze/hooks/useCompareItems';
import ProviderIcon from '@modules/analyze/components/ProviderIcon';
import CompassSquareLogo from '@public/images/logos/compass-square.svg';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { elementToSVG, inlineResources } from 'dom-to-svg';

const genQrcode = (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(text, { errorCorrectionLevel: 'H' }, (error, url) => {
      if (error) reject(error);
      return resolve(url);
    });
  });
};

interface DownLoadImageProps {
  size: 'middle' | 'full';
  cardRef: RefObject<HTMLElement>;
  loadingDownLoadImg: boolean;
  qrcodeLink?: string;
  fileFormat: string;
  onComplete: () => void;
  onCompleteLoad: () => void;
}

const DownLoadImage = (props: DownLoadImageProps) => {
  const {
    cardRef,
    size = 'middle',
    loadingDownLoadImg,
    fileFormat,
    onComplete,
    onCompleteLoad,
  } = props;

  const { t } = useTranslation();
  const downloadDivRef = useRef<HTMLDivElement>(null);
  const cardImgRef = useRef<HTMLImageElement>(null);
  const qrcodeImgRef = useRef<HTMLImageElement>(null);
  const cardDownRef = useRef<HTMLImageElement>(null);
  const qrcodeDownRef = useRef<HTMLImageElement>(null);

  const { compareItems } = useCompareItems();

  useEffect(() => {
    const fetchData = async () => {
      //  qrcode img
      const qrcodeUrl = await genQrcode(window.location.href);
      qrcodeImgRef.current!.src = qrcodeUrl;
      qrcodeDownRef.current!.src = qrcodeUrl;
      // chart img
      if (size === 'middle') {
        cardRef.current!.style.width = '1200px';
      }
      await sleep(300);
      const canvas = await html2canvas(cardRef.current!, {
        backgroundColor: 'rgba(0,0,0,0)',
        ignoreElements: (el) => {
          return el.hasAttribute('data-html2canvas-ignore');
        },
      });
      const dataURL = canvas.toDataURL('image/png');
      cardImgRef.current!.src = dataURL;
      cardDownRef.current!.src = dataURL;
      cardRef.current!.style.removeProperty('width');
      await sleep(300);
      onCompleteLoad();
    };
    const timer = setTimeout(() => {
      fetchData().catch((e) => {
        console.log('error:', e);
      });
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [downloadDivRef, cardRef, cardImgRef, size]);

  useEffect(() => {
    const downLoadImg = async () => {
      if (loadingDownLoadImg) {
        // download img
        if (fileFormat === 'PNG') {
          const downloadImgCanvas = await html2canvas(downloadDivRef.current!, {
            backgroundColor: 'rgba(0,0,0,0)',
          });
          // trigger download
          downloadImgCanvas.toBlob(function (blob) {
            if (blob) {
              saveAs(blob!, `${Date.now()}.png`);
            }
            onComplete();
          });
        } else {
          // Capture specific element
          const svgDocument = elementToSVG(downloadDivRef.current!);
          // Inline external resources (fonts, images, etc) as data: URIs
          await inlineResources(svgDocument.documentElement);
          // Get SVG string
          const svgString = new XMLSerializer().serializeToString(svgDocument);
          var link = document.createElement('a');
          link.download = `${Date.now()}.svg`;
          link.href =
            'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
          link.click();
          onComplete();
        }
      }
    };
    downLoadImg().catch((e) => {
      console.log('error:', e);
    });
  }, [loadingDownLoadImg]);
  return (
    <div
      className={classnames(
        "flex flex-col bg-[url('/images/analyze/share-card-bg.jpg')]"
      )}
    >
      <div className="my-4 flex flex-wrap items-center justify-center leading-8">
        {compareItems.map(({ name, label, level }, index) => {
          const host = getProvider(label);

          let labelNode = (
            <span className={'ml-2 mr-1 text-xs font-semibold text-black'}>
              {name}
            </span>
          );

          if (level === Level.REPO) {
            labelNode = (
              <a
                className="ml-2 mr-1 whitespace-nowrap text-xs font-semibold text-black hover:underline"
                href={label}
                target="_blank"
                rel={'noreferrer'}
              >
                {name}
              </a>
            );
          }
          return (
            <div key={label} className={classnames('flex items-center')}>
              <ProviderIcon provider={host} className="text-sm" />
              {labelNode}
              {level === Level.COMMUNITY && (
                <div className="ml-2 rounded-[10px] bg-[#FFF9F2] px-2 py-0.5 text-xs text-[#D98523]">
                  {t('home:community')}
                </div>
              )}
              {index < compareItems.length - 1 ? (
                <span className="px-2 text-xs text-gray-600">vs</span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        className={classnames('mx-auto mb-4 min-h-[200px] shadow-2xl', {
          'w-[520px]': true,
        })}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={cardImgRef} className="w-full" alt="" />
      </div>
      <div className="mb-2 flex justify-end px-12">
        <div className="mr-2 h-7 w-7 bg-slate-100">
          <CompassSquareLogo />
        </div>
        <div className="h-7 w-7 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={qrcodeImgRef} className="w-full" alt="" />
        </div>
      </div>
      <div className="mx-12 mb-2 origin-right scale-50">
        <p className="text-right text-xs  text-white">
          Powered by oss-compass.org
        </p>
        <p className="text-right text-xs  text-white ">
          Scan the QR code above to read full report
        </p>
      </div>
      <Portal>
        <div
          ref={downloadDivRef}
          className={classnames(
            'z-modal fixed -top-[10000px] w-[1200px]',
            "bg-[url('/images/analyze/share-card-bg(1).jpg')]",
            { '!top-0 ': false }
          )}
        >
          <div className="mt-8 mb-8 flex flex-wrap items-center justify-center leading-8">
            {compareItems.map(({ name, label, level }, index) => {
              const host = getProvider(label);

              let labelNode = (
                <span className={'ml-2 mr-1 text-2xl font-semibold text-black'}>
                  {name}
                </span>
              );

              if (level === Level.REPO) {
                labelNode = (
                  <a
                    className="ml-2 mr-1 whitespace-nowrap text-2xl font-semibold text-black hover:underline"
                    href={label}
                    target="_blank"
                    rel={'noreferrer'}
                  >
                    {name}
                  </a>
                );
              }
              return (
                <div key={label} className={classnames('flex items-center')}>
                  <ProviderIcon provider={host} className="text-3xl" />
                  {labelNode}
                  {level === Level.COMMUNITY && (
                    <div className="ml-2 rounded-[10px] bg-[#FFF9F2] px-2 py-0.5 text-xs text-[#D98523]">
                      {t('home:community')}
                    </div>
                  )}
                  {index < compareItems.length - 1 ? (
                    <span className="px-2 text-2xl text-gray-600">vs</span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div
            className={classnames('mx-auto mb-8 shadow-2xl', {
              'w-[1100px]': true,
            })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={cardDownRef} className="w-full" alt="" />
          </div>
          <div className="mb-2 flex justify-end px-12">
            <div className="mr-4 h-14 w-14 bg-slate-100">
              <CompassSquareLogo />
            </div>
            <div className="h-14 w-14 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={qrcodeDownRef} className="w-full" alt="" />
            </div>
          </div>
          <div className="mb-8 px-12">
            <p className="text-right text-sm text-white">
              Powered by oss-compass.org
            </p>
            <p className="text-right text-sm text-white">
              Scan the QR code above to read full report
            </p>
          </div>
        </div>
      </Portal>
    </div>
  );
};

export default DownLoadImage;
