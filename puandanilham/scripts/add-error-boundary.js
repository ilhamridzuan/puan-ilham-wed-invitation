const fs = require('fs');
const path = require('path');

const mainPagePath = path.join(__dirname, '../src/components/MainPage.tsx');
let mainContent = fs.readFileSync(mainPagePath, 'utf8');

if (!mainContent.includes('ErrorBoundary')) {
  mainContent = mainContent.replace(
    'import { lazy, Suspense } from "react";',
    'import { lazy, Suspense } from "react";\nimport { ErrorBoundary } from "./ErrorBoundary";'
  );

  const sections = [
    { name: 'Intro', tag: '<IntroSection />' },
    { name: 'Quran', tag: '<QuranSection />' },
    { name: 'Invitation', tag: '<InvitationSection />' },
    { name: 'DateLocation', tag: '<DateLocationSection />' },
    { name: 'Schedule', tag: '<ScheduleSection />' },
    { name: 'DressCode', tag: '<DressCodeSection />' },
    { name: 'RSVP', tag: '<RSVPSection />' },
    { name: 'Wishes', tag: '<WishesSection />' },
    { name: 'Footer', tag: '<FooterSection />' }
  ];

  for (const section of sections) {
    if (section.name === 'Intro') {
      mainContent = mainContent.replace(
        '<IntroSection />',
        `<ErrorBoundary sectionName="${section.name}">\n        <IntroSection />\n      </ErrorBoundary>`
      );
    } else {
      mainContent = mainContent.replace(
        `<Suspense fallback={<SectionLoader />}>\n        ${section.tag}\n      </Suspense>`,
        `<ErrorBoundary sectionName="${section.name}">\n      <Suspense fallback={<SectionLoader />}>\n        ${section.tag}\n      </Suspense>\n      </ErrorBoundary>`
      );
    }
  }

  // Handle Footer separately because it has fallback={null}
  mainContent = mainContent.replace(
    `<Suspense fallback={null}>\n        <FooterSection />\n      </Suspense>`,
    `<ErrorBoundary sectionName="Footer">\n      <Suspense fallback={null}>\n        <FooterSection />\n      </Suspense>\n      </ErrorBoundary>`
  );

  fs.writeFileSync(mainPagePath, mainContent, 'utf8');
  console.log('MainPage updated with ErrorBoundary');
}

const pbMainPagePath = path.join(__dirname, '../src/components/Photobooth/PhotoboothMainPage.tsx');
if (fs.existsSync(pbMainPagePath)) {
  let pbContent = fs.readFileSync(pbMainPagePath, 'utf8');
  if (!pbContent.includes('ErrorBoundary')) {
    pbContent = pbContent.replace(
      'import { lazy, Suspense } from "react";',
      'import { lazy, Suspense } from "react";\nimport { ErrorBoundary } from "../ErrorBoundary";'
    );
    
    // In PhotoboothMainPage, it might have PhotoboothIntroSection and PhotoboothMemorySection
    pbContent = pbContent.replace(
      '<PhotoboothIntroSection />',
      '<ErrorBoundary sectionName="PhotoboothIntro">\n        <PhotoboothIntroSection />\n      </ErrorBoundary>'
    );

    pbContent = pbContent.replace(
      `<Suspense fallback={<SectionLoader />}>\n          <PhotoboothMemorySection />\n        </Suspense>`,
      `<ErrorBoundary sectionName="PhotoboothMemory">\n        <Suspense fallback={<SectionLoader />}>\n          <PhotoboothMemorySection />\n        </Suspense>\n        </ErrorBoundary>`
    );
    
    fs.writeFileSync(pbMainPagePath, pbContent, 'utf8');
    console.log('PhotoboothMainPage updated with ErrorBoundary');
  }
}
