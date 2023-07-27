import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import  * as SessionActions from '../../../actions/session';
import { decodeErrors } from '../../../utils/validation/main';
import Theme from '../../../utils/theme';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import Input from '../../base/inputs/String';
import PasswordInput from '../../base/inputs/Password';
import history from '../../../history';

import styles from './LoginPage.less';

const cx = classnames.bind(styles);

class LoginPage extends PureComponent {
    static propTypes = {
        handleLogin          : PropTypes.func.isRequired,
        intervalCheckSession : PropTypes.func.isRequired,
        route                : PropTypes.string.isRequired
    }
    static contextType = Theme; //eslint-disable-line

    state = {
        username : '',
        password : '',
        errors   : {
            username : '',
            password : ''
        }
    }
    componentDidMount() {
        const { intervalCheckSession, route } = this.props;

        intervalCheckSession(route);
    }

    handleFocus = () => {
        this.setState({
            errors : {
                username : '',
                password : ''
            }
        });
    }


    handleChangeInput = (name) => (value) => {
        const isValueValid = /^\S*$/.test(value);

        if (isValueValid) {
            this.setState({
                [name] : value,
                errors : {
                    ...this.state.errors,
                    [name] : ''
                }
            });
        }
    }

    handleSaveButtonClick = async (e) => {
        const { username, password } = this.state;
        const payload = {
            username : username.trim(),
            password : password.trim()
        };
        const { handleLogin } = this.props;


        e.preventDefault();
        try {
            this.setState({ isLoading: true });

            await handleLogin(payload);

            this.setState({ isLoading: false });
            history.replace('/admin');
        } catch (error) {
            const errors = error.fields ? decodeErrors(error.fields) : {};

            this.setState({
                isLoading : false,
                errors    : { ...errors }
            });
        }
    }

    render() {
        const { username, password, errors, isLoading } = this.state;
        const { theme } = this.context;
        const loginPageCN = cx('LoginPage', { dark: theme === 'DARK' });
        const { username: usernameError, password: passwordError } = errors;

        return (
            <div className={loginPageCN}>
                <div className={styles.inputsContainer}>
                    <form className={styles.form}>
                        <div className={styles.inputConatiner}>
                            <div className={styles.logo}>
                                <Icon type='logo-dashboard' />
                            </div>
                            <div className={styles.inputWrapper}>
                                <Input
                                    value={username}
                                    placeholder={'Login'}
                                    onChange={this.handleChangeInput('username')}
                                    onFocus={this.handleFocus}
                                    className='form'
                                    isInvalid={!!usernameError || !!passwordError === 'The values you entered are incorrect'}
                                    darkThemeSupport
                                    maxLength={50}
                                    maximumHarcodingIOS
                                />
                            </div>
                            <div className={styles.errorMessage}>{usernameError}</div>
                        </div>
                        <div className={styles.inputConatiner}>
                            <div className={styles.inputWrapper}>
                                <PasswordInput
                                    value={password}
                                    type='password'
                                    placeholder={'Password'}
                                    onChange={this.handleChangeInput('password')}
                                    onFocus={this.handleFocus}
                                    className='form'
                                    maxLength={30}
                                    isInvalid={!!passwordError}
                                    darkThemeSupport
                                    maximumHarcodingIOS
                                />
                            </div>
                            <div className={styles.errorMessage}>{passwordError}</div>
                        </div>
                        <Button
                            text='Sign in'
                            onClick={this.handleSaveButtonClick}
                            isFetching={isLoading}
                            className={styles.saveButton}
                            type='submit'
                        />
                    </form>

                </div>
            </div>
        );
    }
}


export default connect(null, { ...SessionActions })(LoginPage);
