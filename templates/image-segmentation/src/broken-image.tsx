// tslint:disable
import * as React from 'react';
import Icon from 'material-ui/Icon';

export function BrokenImage({imageUrl}: {imageUrl: string}) {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{
        display: 'flex',
        flexGrow: '1',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px'
      } as any}>
        <Icon style={{color: 'grey', fontSize: '200px'}}>broken_image</Icon>
        <div style={{color: 'grey', fontStyle: 'italic',}}>
          Error loading <a href={imageUrl} target="_blank">{imageUrl}</a>.
          Please confirm that this url is live and a direct link to an image. Webpage links are not supported.
        </div>
      </div>
    </div>
  );
}
