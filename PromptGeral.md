Boa Noite, eu me chamo Wuallan, mas pode me chamar de Len!
Eu estudo em uma das várias instituições educacionais SESI, no caso, a 283, eu estou cursando o ultimo ano do Ensino Médio (3 Ano EM), e junto desse ano, está o ultimo ano do curso de DS no VsCode, Desenvolvimento de Sistemas na área de TI, sendo nosso principal e único curso técnico, eu aprendi muito até hoje, porem, não consigo fazer nada ainda totalmente sozinho, já "fiz", vários projetos particulares pequenos, mas agora, quero pensar grande, quero fazer um site react, com sua ajuda. (em vez de arquivos js, gostariam que fosse tsx, pois já estou acostumado, eu queria sua ajuda para terminar isso, no básico mesmo, não algo tão complexo e detalhado (criar por react e dar npm run dev)

Ele vai ser em react, o site tem que ter a seguintes telas:

-Login e Cadastro (FireBase)
-Home (Terá a apresentação do site com algumas seções)
-Games (Uma página de escolhas de games que leva para cada jogo com seu próprio css cada)
-Uma página de perfil (totalmente funcional, ligada ao FireBase)
-Uma tela de configurações (totalmente funcional para o resto do site)

E por enquanto é isso que quero, e no final, quero dar o Deploy no Vencel, assim subindo o servidor publicamente, para meus amigos poderem usar o site, sendo um site normal como qualquer outro, por isso, quero sua ajuda, passo a passo, para me ajudar nessa jornada, eu posso ter esquecido alguma coisa, mas com o tempo, iremos arrumar, eu me chamo Len, e obrigado pela a atenção.

npm create vite@latest
npm install firebase
npm install -g firebase-tools
npm install react-hot-toast

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWDgWzb3hbq94nMDPOXugc06VStWW2VdY",
  authDomain: "lengames-3d2e5.firebaseapp.com",
  projectId: "lengames-3d2e5",
  storageBucket: "lengames-3d2e5.firebasestorage.app",
  messagingSenderId: "125350704404",
  appId: "1:125350704404:web:63637529aa81b02fc63e01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);