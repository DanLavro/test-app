import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ProgressBarAndroid} from 'react-native';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.APP_OPEN
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const timeout = useRef(null);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setIsAdLoaded(true);
      },
    );

    interstitial.load();

    progressInterval.current = setInterval(() => {
      setProgress(prevProgress => prevProgress + 1);
    }, 100);

    timeout.current = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(progressInterval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (isAdLoaded) {
      interstitial.show();
    }
  }, [isAdLoaded]);

  useEffect(() => {
    if (isAdLoaded || progress >= 100) {
      clearInterval(progressInterval.current);
    }
  }, [isAdLoaded, progress]);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAdLoaded && !isLoading) {
      setIsLoading(false);
    }
  }, [isAdLoaded, isLoading]);

  return (
    <View>
      {isLoading && (
        <>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress / 100}
          />
          <Text>Hello World</Text>
        </>
      )}
      {!isLoading && <Text>Welcome to my app</Text>}
    </View>
  );
};

export default App;
