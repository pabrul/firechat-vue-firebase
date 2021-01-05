<template>
  <div class="view login" v-if="state.username === '' || state.username === null">
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1 class="custom-letter"><i class="fas fa-fire"></i>Vue FireChat</h1>
        <!-- <label for="username">Username</label>
         <input class="normal"
          type="text" 
          v-model="inputUsername" 
          placeholder="Please enter your username..." />  -->

					<!-- custom input -->
					<div class="form__group field">
						<input 	autocomplete="off" 
										type="text" 
										v-model="inputUsername" 
										placeholder="Please enter your username..." class="form__field"/>
						<label for="name" class="form__label">						
						<i class="fa fa-user" aria-hidden="true"></i>
							Name
						</label>
					</div>
					<!-- custom input-->

        <input 
					class="custom-submit"
          type="submit" 
          value="Login" />

      </div>
    </form>
  </div>
  
  <div class="view chat" v-else>
    <header>
      <button class="logout text-focus-in" @click="Logout">Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>
    
    <section class="chat-box">
      <div 
        v-for="message in state.messages" 
        :key="message.key" 
        :class="(message.username == state.username ? 'message current-user' : 'message')">
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input class="footer"
          type="text" 
          v-model="inputMessage" 
          placeholder="Write a message..." />
        <input class="shake"
          type="submit" 
          value="Send" />
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import db from './db';

export default {
  setup () {
    const inputUsername = ref("");
    const inputMessage = ref("");

    const state = reactive({
      username: "",
      messages: []
    });

    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    }

    const Logout = () => {
      state.username = "";
    }

    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");

      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value
      }

      messagesRef.push(message);
      inputMessage.value = "";
    }

    onMounted(() => {
      const messagesRef = db.database().ref("messages");

      messagesRef.on('value', snapshot => {
        const data = snapshot.val();
        let messages = [];

        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          });
        });

        state.messages = messages;
      });
    });

    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout
    }
  }
}
</script>

<style lang="scss">
* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.view {
	display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #009688;
	
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 100%;
			padding: 15px;
			
			.form-inner {
				display: block;
				background-color: #FFF;
				padding: 50px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);

				h1 {
					font-size: 28px;
					margin-bottom: 30px;
					color: #009688 !important;
					font-family: 'Raleway',sans-serif;
					font-weight: 800;
					line-height: 72px;
					text-align: center;
					text-transform: uppercase;
				}

				label {
					display: block;
					margin-bottom: 5px;
					color: #AAA;
					font-size: 16px;
					transition: 0.4s;
					margin-top: -10px;
				}

				input.normal[type="text"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px;
					margin-bottom: 15px;
					
					color: #333;
					font-size: 18px;

					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;

					transition: 0.4s;

					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}

				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 10px 15px;
					background-color: #009688;
					border-radius: 8px;

					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}

				&:focus-within {
					label {
						color: #009688;
					}

					input.normal[type="text"] {
						background-color: #FFF;
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

						&::placeholder {
							color: #666;
						}
					}
				}
			}
		}
	}

	&.chat {
		flex-direction: column;

		header {
			position: relative;
			display: block;
			width: 100%;
			padding: 50px 30px 10px;

			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: none;
				
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
				

		
			}

			h1 {
				color: #FFF;
			}
		}

		.chat-box {
			border-radius: 24px 24px 0px 0px;
			background-color: #FFF;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;

			.message {
				display: flex;
				margin-bottom: 15px;
				
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						padding-left: 15px;
						padding-right: 15px;
					}

					.content {
						display: inline-block;
						padding: 10px 20px;
						background-color: #F3F3F3;
						border-radius: 999px;

						color: #333;
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}

				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;

					.message-inner {
						max-width: 75%;

						.content {
							color: #FFF;
							font-weight: 600;
							background-color: #009688;
						}
					}
				}
			}
		}

		footer {
			position: sticky;
			bottom: 0px;
			background-color: #FFF;
			padding: 30px;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);

			form {
				display: flex;

				input.footer[type="text"] {
					flex: 1 1 100%;

					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px 0px 0px 8px;
					
					color: #333;
					font-size: 18px;

					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;

					transition: 0.4s;

					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					padding: 10px 15px;
					border-radius: 0px 8px 8px 0px;

					background-color: #009688;

					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}

.form__group {
  position: relative;
  padding: 15px 3px 30px;
  margin-top: 30px;
  margin-bottom: 26px;
  width: 100%;
}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  outline: 0;
  font-size: 1.3rem;
  color: #494949;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
}
.form__field::placeholder {
  color: transparent;
}
.form__field:placeholder-shown ~ .form__label {
  font-size: 1.3rem;
  cursor: text;
  top: 34px;
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #9b9b9b;
}

.form__field:focus {
  padding-bottom: 6px;
  font-weight: 700;
  border-width: 3px;
  border-image: linear-gradient(to right, #11998e, #38ef7d);
  border-image-slice: 1;
}
.form__field:focus ~ .form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #11998e;
  font-weight: 700;
}

/* reset input */
.form__field:required, .form__field:invalid {
  box-shadow: none;
}

i.fa.fa-user {
    margin-right: 5px;
}

/* animation */
.custom-letter {
-webkit-animation: custom-letter 3s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
animation: custom-letter 3s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
}

@-webkit-keyframes custom-letter {
0% {
letter-spacing: -0.5em;
opacity: 0;
  }
40% {
opacity: 0.6;
  }
100% {
opacity: 1;
  }
}
@keyframes custom-letter {
0% {
letter-spacing: -0.5em;
opacity: 0;
  }
40% {
opacity: 0.6;
  }
100% {
opacity: 1;
  }
}

input.custom-submit {
  background-image: linear-gradient(to right, #009688, #c8e8e5, #1fa296) !important;
	text-transform: uppercase !important;
  font-weight: 900 !important;
	color: #009688 !important;
}


i.fas.fa-fire {
    margin-right: 5px;
}

.text-focus-in {
-webkit-animation: text-focus-in 2s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
animation: text-focus-in 2s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

@-webkit-keyframes text-focus-in {
0% {
-webkit-filter: blur(12px);
filter: blur(12px);
opacity: 0;
}
100% {
-webkit-filter: blur(0px);
filter: blur(0px);
opacity: 1;
}
}
@keyframes text-focus-in {
0% {
-webkit-filter: blur(12px);
filter: blur(12px);
opacity: 0;
}
100% {
-webkit-filter: blur(0px);
filter: blur(0px);
opacity: 1;
}
}


.shake {
  animation: shake-animation 4.72s ease infinite;
  transform-origin: 50% 50%;
}

@keyframes shake-animation {
   0% { transform:translate(0,0) }
  1.78571% { transform:translate(5px,0) }
  3.57143% { transform:translate(0,0) }
  5.35714% { transform:translate(5px,0) }
  7.14286% { transform:translate(0,0) }
  8.92857% { transform:translate(5px,0) }
  10.71429% { transform:translate(0,0) }
  100% { transform:translate(0,0) }
}
</style>

