import * as React from 'react';
import ClassificationForm from './classification-options';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import styled from 'styled-components';

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  max-height: 80vh;
`;

const Sidebar = styled.div`
  box-shadow: 2px 0px 13px #bfbfbf;
  background-color: white;
  min-width: 280px;
  max-width: 280px;
  flex-direction: column;
  margin-right: 50px;
`;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1
`;

const ImageFrame = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
`

export class LabelingScreen extends React.Component {
  state: {
    loading: boolean,
    errorLoadingImage: boolean,
    label?: string,
  } = {
    loading: true,
    errorLoadingImage: false,
  }
  props: {
    imageUrl?: string;
    onSkip: Function;
    onSubmit: Function;
  }

  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = () => {
      this.props.onSubmit(this.state.label);
      this.setState({...this.state, label: undefined, loading: true});
    };

    const onSkip = () => {
      this.props.onSkip();
      this.setState({...this.state, label: undefined, loading: true});
    };

    return (
      <Content>
        <Sidebar>
          <div className="form-controls">
            <div className="classification">
              <ClassificationForm
                value={this.state.label || ''}
                onSelect={(label: string) => this.setState({...this.state, label})}
              />
              </div>
            <div className="form-buttons">
            </div>
          </div>
          <div style={{justifyContent: 'flex-end'}}>
            <Button onClick={onSkip} >Skip</Button>
            <Button
              variant="raised"
              color="primary"
              disabled={!this.state || !this.state.label}
              onClick={() => onSubmit()}
            >Submit</Button>
          </div>
        </Sidebar>
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
