import * as React from 'react';
import ClassificationForm, { Label } from './classification-options';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import styled from 'styled-components';

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  max-height: 80vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  margin-left: 50px;
  margin-right: 50px;
`;

const ImageFrame = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: #dddddd;
`

export class LabelingScreen extends React.Component {
  public state: {
    loading: boolean,
    errorLoadingImage: boolean,
  } = {
    loading: true,
    errorLoadingImage: false,
  }
  public props: {
    imageUrl?: string;
    label?: Label;
    onSkip: Function;
    onSubmit: Function;
  }

  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = () => {
      this.props.onSubmit();
      this.setState({...this.state, label: undefined, loading: true});
    };

    const onSkip = () => {
      this.props.onSkip();
      this.setState({...this.state, label: undefined, loading: true});
    };

    return (
      <Content>
        <ClassificationForm
          label={this.props.label || {}}
          onLabelUpdate={(label: Label) => this.setState({...this.state, label})}
          onSubmit={onSubmit}
          onSkip={onSkip}
        />
        <MainContent>
          {
            this.state.loading && (<LinearProgress color="primary" />)
          }
          <ImageFrame>
            {
              this.props.imageUrl && !this.state.errorLoadingImage &&
                (<img style={{maxWidth: '100%', maxHeight: '100%', opacity: this.state.loading ? '0.2' : '1'} as any}
                    src={this.props.imageUrl}
                    onLoad={(e) => this.setState({...this.state, loading: false})}
                    onError={() => this.setState({...this.state, loading: false, errorLoadingImage: true})}
                    alt="classify-data"
                  />)
            }
          </ImageFrame>
          {
            this.state.errorLoadingImage && (
              <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', alignItems: 'center'} as any}>
                <Icon style={{color: 'grey', fontSize: '200px'}}>broken_image</Icon>
                <div style={{color: 'grey', fontStyle: 'italic'}}>
                  Error loading <a href={this.props.imageUrl} target="_blank">{this.props.imageUrl}</a>. Please confirm that this url is live and a direct link to an image. Webpage links are not supported.
                </div>
              </div>
            )
          }
        </MainContent>
      </Content>
    );
  }
}
