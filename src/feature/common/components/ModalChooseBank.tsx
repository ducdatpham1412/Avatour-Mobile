import {Metrics} from 'asset/metrics';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import AutoHeightImage from 'components/AutoHeightImage';
import {AppInput, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import I18Next from 'utility/I18Next';
import {logger} from 'utility/assistant';

interface Props {
  bank: any;
  onChangeBank(value: any): void;
  theme: TypeTheme;
}

interface States {
  listBanks: Array<any>;
  displayBanks: Array<any>;
}

const {height, width, safeBottomPadding} = Metrics;

class ModalChooseBank extends Component<Props, States> {
  modalRef = React.createRef<Modalize>();

  inputRef = React.createRef<TextInput>();

  timeout: any = null;

  state: States = {
    listBanks: [],
    displayBanks: [],
  };

  show() {
    this.modalRef.current?.open();
  }

  componentDidMount() {
    const getData = async () => {
      try {
        const res = await fetch('https://api.vietqr.io/v2/banks');
        const data = await res.json();
        this.setState({
          listBanks: data.data,
          displayBanks: data.data,
        });
      } catch (err) {
        logger(err);
      }
    };
    getData();
  }

  private onConfirm = (value: any) => {
    this.props.onChangeBank(value);
    this.modalRef.current?.close();
  };

  private renderItemBank(item: any) {
    const isChosen = item.id === this.props.bank?.id;

    return (
      <StyleTouchable
        customStyle={[
          styles.itemView,
          {borderColor: isChosen ? Theme.common.red : 'transparent'},
        ]}
        onPress={() => this.onConfirm(item)}>
        <AutoHeightImage
          uri={item?.logo || ''}
          customStyle={{
            width: '100%',
          }}
          defaultImageSource="image"
        />
      </StyleTouchable>
    );
  }

  private onSearch(text: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (!text) {
        this.setState({
          displayBanks: this.state.listBanks,
        });
      } else {
        const textLowerCase = text.toLocaleLowerCase();
        const temp = this.state.listBanks.filter(item => {
          if (
            item?.name?.toLocaleLowerCase().includes(textLowerCase) ||
            item?.code?.toLocaleLowerCase().includes(textLowerCase) ||
            item?.shortName?.toLocaleLowerCase().includes(textLowerCase) ||
            item?.short_name?.toLocaleLowerCase().includes(textLowerCase)
          ) {
            return true;
          }
          return false;
        });
        this.setState({
          displayBanks: temp,
        });
      }
    }, 100);
  }

  render() {
    const {theme} = this.props;
    const {displayBanks} = this.state;

    return (
      <Modalize
        ref={this.modalRef}
        modalStyle={{backgroundColor: theme.background}}
        withHandle={false}
        modalHeight={height / 1.5}>
        <View style={[styles.container, {backgroundColor: theme.background}]}>
          <View style={styles.headerView}>
            <StyleText
              i18Text="profile.bank"
              customStyle={styles.textChooseBank}
            />
            <ButtonX
              containerStyle={styles.buttonClose}
              onPress={() => {
                this.modalRef.current?.close();
              }}
            />
          </View>

          <View style={[styles.inputView, {backgroundColor: theme.white}]}>
            <AntDesign
              name="search1"
              style={[styles.iconSearch, {color: theme.black}]}
            />
            <AppInput
              onChangeText={text => {
                this.onSearch(text);
              }}
              style={styles.inputBox}
              placeholder={I18Next.t('common.search')}
            />
          </View>

          <View style={styles.contentView}>
            <StyleList
              data={displayBanks}
              keyExtractor={item => String(item?.id)}
              renderItem={({item}) => this.renderItemBank(item)}
              numColumns={3}
              contentContainerStyle={styles.contentContainer}
            />
          </View>
        </View>
      </Modalize>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    height: height / 1.5,
    backgroundColor: 'red',
    borderTopLeftRadius: '5@ms',
    borderTopRightRadius: '5@ms',
  },
  headerView: {
    width: '100%',
    paddingVertical: '5@vs',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonClose: {
    position: 'absolute',
    right: '7@s',
    top: undefined,
  },
  textChooseBank: {
    fontWeight: 'bold',
  },
  contentView: {
    flex: 1,
  },
  itemView: {
    width: width / 3 - 5,
    backgroundColor: Theme.common.white,
    marginHorizontal: 1.5,
    marginVertical: 1.5,
    borderRadius: '5@ms',
    borderWidth: '1@ms',
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: safeBottomPadding,
  },
  inputView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: '5@vs',
    paddingHorizontal: '10@s',
    borderRadius: '10@ms',
    alignItems: 'center',
  },
  iconSearch: {
    fontSize: '20@ms',
    marginRight: '5@s',
  },
  inputBox: {
    flex: 1,
    paddingTop: '7@ms',
    paddingBottom: '7@ms',
  },
});

export default ModalChooseBank;
