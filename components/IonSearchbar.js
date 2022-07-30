import { useEffect, useRef } from 'react';

const IonSearchbar = ({onChange, id}) => {
  const ref = useRef()

    useEffect(() => {
      ref?.current?.addEventListener('ionChange', onChange);
    
        // cleanup this component
        return () => {
          ref?.current?.removeEventListener('ionChange', onChange);
        };
      }, []);

    return (
        <ion-searchbar ref={ref} animated show-cancel-button="focus" />
    )
}

export default IonSearchbar
