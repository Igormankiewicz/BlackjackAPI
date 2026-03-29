--
-- PostgreSQL database dump
--

\restrict G4tcSXBTTrrSzBWITJEwY02Bacsk4aOVSqprExfK8ds7ayq9OM1CvVp9u4XhGry

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-29 20:03:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16398)
-- Name: cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cards (
    id integer NOT NULL,
    name character varying(5),
    suit character varying(8),
    value integer,
    file_path character varying(255)
);


--
-- TOC entry 221 (class 1259 OID 16397)
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 221
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- TOC entry 228 (class 1259 OID 16450)
-- Name: game_state; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.game_state (
    id integer NOT NULL,
    match_id integer,
    card_id integer,
    owner_id integer,
    card_order integer
);


--
-- TOC entry 227 (class 1259 OID 16449)
-- Name: game_state_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.game_state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 227
-- Name: game_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.game_state_id_seq OWNED BY public.game_state.id;


--
-- TOC entry 226 (class 1259 OID 16427)
-- Name: match_players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.match_players (
    id integer NOT NULL,
    match_id integer,
    user_id integer,
    hand_value integer DEFAULT 0,
    has_busted boolean DEFAULT false,
    is_staying boolean DEFAULT false
);


--
-- TOC entry 225 (class 1259 OID 16426)
-- Name: match_players_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.match_players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 225
-- Name: match_players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.match_players_id_seq OWNED BY public.match_players.id;


--
-- TOC entry 224 (class 1259 OID 16406)
-- Name: matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    status character varying(20) DEFAULT 'waiting'::character varying,
    current_turn_user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 223 (class 1259 OID 16405)
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 223
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50),
    password character varying(100)
);


--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4776 (class 2604 OID 16401)
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 16453)
-- Name: game_state id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_state ALTER COLUMN id SET DEFAULT nextval('public.game_state_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 16430)
-- Name: match_players id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_players ALTER COLUMN id SET DEFAULT nextval('public.match_players_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 16409)
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4953 (class 0 OID 16398)
-- Dependencies: 222
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cards (id, name, suit, value, file_path) FROM stdin;
\.


--
-- TOC entry 4959 (class 0 OID 16450)
-- Dependencies: 228
-- Data for Name: game_state; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.game_state (id, match_id, card_id, owner_id, card_order) FROM stdin;
\.


--
-- TOC entry 4957 (class 0 OID 16427)
-- Dependencies: 226
-- Data for Name: match_players; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.match_players (id, match_id, user_id, hand_value, has_busted, is_staying) FROM stdin;
\.


--
-- TOC entry 4955 (class 0 OID 16406)
-- Dependencies: 224
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.matches (id, status, current_turn_user_id, created_at) FROM stdin;
\.


--
-- TOC entry 4951 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, password) FROM stdin;
\.


--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 221
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cards_id_seq', 1, false);


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 227
-- Name: game_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.game_state_id_seq', 1, false);


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 225
-- Name: match_players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.match_players_id_seq', 1, false);


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 223
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.matches_id_seq', 1, false);


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4788 (class 2606 OID 16404)
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16456)
-- Name: game_state game_state_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_state
    ADD CONSTRAINT game_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 16438)
-- Name: match_players match_players_match_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_players
    ADD CONSTRAINT match_players_match_id_user_id_key UNIQUE (match_id, user_id);


--
-- TOC entry 4794 (class 2606 OID 16436)
-- Name: match_players match_players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_players
    ADD CONSTRAINT match_players_pkey PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 16414)
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 16396)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 16462)
-- Name: game_state game_state_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_state
    ADD CONSTRAINT game_state_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cards(id);


--
-- TOC entry 4801 (class 2606 OID 16457)
-- Name: game_state game_state_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_state
    ADD CONSTRAINT game_state_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- TOC entry 4802 (class 2606 OID 16467)
-- Name: game_state game_state_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_state
    ADD CONSTRAINT game_state_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- TOC entry 4798 (class 2606 OID 16439)
-- Name: match_players match_players_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_players
    ADD CONSTRAINT match_players_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- TOC entry 4799 (class 2606 OID 16444)
-- Name: match_players match_players_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_players
    ADD CONSTRAINT match_players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4797 (class 2606 OID 16415)
-- Name: matches matches_current_turn_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_current_turn_user_id_fkey FOREIGN KEY (current_turn_user_id) REFERENCES public.users(id);


-- Completed on 2026-03-29 20:03:14

--
-- PostgreSQL database dump complete
--

\unrestrict G4tcSXBTTrrSzBWITJEwY02Bacsk4aOVSqprExfK8ds7ayq9OM1CvVp9u4XhGry

