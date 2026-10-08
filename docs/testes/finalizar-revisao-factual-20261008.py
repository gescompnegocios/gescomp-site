"""Complementos editoriais e sincronização das fontes, sem rede."""
from pathlib import Path
import json, re, subprocess, sys
from html import escape
import runpy

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT/'publicar'
OUT = ROOT/'docs/evidencias/2026-10-08/revisao-factual'
helper = runpy.run_path(str(Path(__file__).with_name('aplicar-revisao-factual-20261008.py')))
link, sync_ld = helper['link'], helper['sync_ld']
sys.stdout.reconfigure(encoding='utf-8')

extra = {
 'informacoes': [
  ('A reforma reorganiza os tributos sobre o consumo: a CBS substitui o PIS e a Cofins, enquanto o IBS substitui o ICMS e o ISS. A transição acontece em etapas até 2033; o IPI tem tratamento próprio.', 'A reforma substitui PIS/Cofins pela CBS e ICMS/ISS pelo IBS. Também reduz o IPI, com a exceção ligada à Zona Franca de Manaus, e cria o Imposto Seletivo. A transição dos tributos do consumo termina em 2033; os demais impostos e contribuições não desaparecem.')
 ],
 'imposto-de-renda': [
  ('Rendimento do mês (base de cálculo)', 'Base de cálculo após deduções'),
  ('Quem recebe de mais de um lugar precisa acertar a conta na declaração anual, mesmo que cada valor seja menor que R$ 5 mil.', 'Mais de uma fonte pagadora pode gerar imposto no ajuste anual, mesmo que cada pagamento isolado fique abaixo de R$ 5 mil. Se estiver obrigado a declarar, some as rendas e confira o imposto: não conte com isenção pela análise de cada fonte separada.'),
  ('Em 08/10/2026, o prazo e os critérios de obrigatoriedade da declaração de 2027 ainda não haviam sido divulgados: renda mensal isenta não significa dispensa automática de declarar.', 'A redução anual tem limite de R$ 2.694,15 e, na faixa de R$ 60.000,01 a R$ 88.200, usa R$ 8.429,73 − (0,095575 × rendimentos tributáveis anuais), sempre limitada ao imposto apurado. Em 08/10/2026, o prazo e os critérios de obrigatoriedade da declaração de 2027 ainda não haviam sido divulgados: renda mensal isenta não significa dispensa automática de declarar.')
 ],
 'mei': [
  ('Ou o valor proporcional, se abrir no meio do ano.', 'No ano de abertura, use o limite proporcional aos meses, contando a fração como mês inteiro. O MEI Caminhoneiro tem limite próprio.'),
  ('Que receba um salário mínimo ou o piso da categoria.', 'Remuneração contratual de um mínimo ou piso da categoria, com adicionais e direitos legais quando devidos.'),
  ('O limite é de R$ 81 mil por ano. A conta de R$ 6.750 por mês serve só como referência: você pode vender mais em um mês e menos em outro, desde que o total do ano não passe de R$ 81 mil.', 'No MEI geral, o limite é R$ 81 mil por ano-calendário. R$ 6.750 por mês é referência para a proporcionalidade na abertura, não um teto mensal independente: num ano completo, as receitas mensais podem variar, respeitado o total anual.'),
  ('Entregue mesmo assim. A declaração em atraso tem multa mínima de R$ 50.', 'Entregue mesmo assim, mesmo sem receita. A notificação informa a multa e eventual redução; o mínimo legal é R$ 50 antes das reduções aplicáveis. Confira também o prazo especial em caso de baixa.')
 ],
 'abrir-empresa': [
  ('O tipo muda a responsabilidade do dono e os impostos. Nossa equipe ajuda a escolher.', 'Natureza jurídica, porte e regime tributário são escolhas diferentes. A primeira define a organização e a responsabilidade; a tributação depende também da atividade e da receita. Nossa equipe ajuda a comparar.')
 ],
 'pro-labore-e-lucros': [
  ('Resumo das regras gerais em 2026:', 'Resumo de 2026 para sócio pessoa física residente no Brasil, com resultado e documentação regulares. IRRF mensal não encerra a análise do imposto anual:'),
  ('Não. O INSS incide sobre o pró-labore, não sobre a distribuição de lucros.', 'A distribuição de lucro efetivamente apurado e documentado não é remuneração pelo trabalho. O pró-labore está sujeito à contribuição previdenciária; dar o nome de lucro a uma remuneração não afasta o INSS.')
 ],
 'departamento-pessoal': [
  ('Quem ganha o mínimo paga R$ 121,58', '7,5% sobre o salário mínimo; confira a apuração e os centavos no eSocial'),
  ('FGTS sobre o salário', 'FGTS geral sobre a remuneração; aprendiz: 2%'),
  ('isenção de Imposto de Renda', 'faixa de rendimentos tributáveis para redução mensal do IR')
 ],
 'calendario-fiscal': [
  ('Último dia para pedir para entrar ou voltar ao Simples Nacional em 2027.', 'Para ME/EPP já em atividade: último dia de pedido para entrar ou voltar ao Simples em 2027. SIMEI e empresas em abertura têm regras próprias.'),
  ('Quase sempre é possível regularizar, com multa e juros. Quanto antes, melhor. Fale com um de nossos contadores.', 'Depende da obrigação. Tributos e declarações podem exigir multa e juros; prazo de opção por regime não é recuperado apenas pagando multa. Confira a consequência e a forma de regularização para o seu caso.')
 ],
 'fim-escala-6x1': [
  ('chegando a 40 horas 14 meses depois.', 'chegando a 40 horas no 14º mês após a publicação.')
 ]
}
descriptions = {
 'imposto-de-renda': ('Entenda a nova regra do Imposto de Renda em 2026: isenção até R$ 5 mil por mês, desconto até R$ 7.350, dividendos e declaração de 2027. Informações da GESCOMP.', 'IR 2026: redução mensal até R$ 5 mil de rendimentos tributáveis, tabela, dividendos e declaração de 2027. Guia da GESCOMP com leis e fontes oficiais.'),
 'abrir-empresa': ('Passo a passo para abrir empresa: escolher o tipo, registrar na Junta Comercial, obter CNPJ e alvará. Saiba o que muda com o CNPJ alfanumérico. GESCOMP.', 'Como abrir empresa: natureza jurídica, registro, MAT, CNPJ e licenças aplicáveis. Entenda o CNPJ alfanumérico no guia da GESCOMP com fontes oficiais.'),
 'pro-labore-e-lucros': ('Pró-labore e lucros em 2026: INSS, Imposto de Renda e retenção de 10% sobre o total quando a distribuição mensal ultrapassa R$ 50 mil. GESCOMP.', 'Pró-labore e lucros em 2026: INSS, IRRF de sócios residentes, imposto mínimo anual e transição de 2025. Leis e fontes oficiais no guia da GESCOMP.')
}
files={}; changes=[]
fontes=json.loads((OUT/'fontes.json').read_text(encoding='utf-8'))['paginas']
for path in PUB.glob('*.html'):
 raw=path.read_text(encoding='utf-8');before=raw;slug=path.stem
 for old,new in extra.get(slug,[]):
  assert old in raw, (slug,old)
  raw=raw.replace(old,escape(new,quote=False));changes.append({'pagina':slug,'antes':old,'depois':new})
 if slug in descriptions:
  old,new=descriptions[slug];assert old in raw;raw=raw.replace(old,new)
 if slug=='imposto-de-renda':raw=raw.replace('Imposto de Renda 2026: isenção até R$ 5 mil | GESCOMP', 'Imposto de Renda 2026: redução, tabela e dividendos | GESCOMP')
 if slug=='pro-labore-e-lucros':
  pos=raw.index('Lucros até R$ 50 mil por mês, da mesma empresa');end=raw.index('Lucros acima de R$ 50 mil por mês, da mesma empresa',pos)
  segment=raw[pos:end]
  old='color: var(--texto2)">Não</span>'
  assert segment.count(old)==1
  segment=segment.replace(old,'color: var(--texto2)">Sem IRRF mensal nessa regra; pode haver imposto mínimo anual</span>')
  raw=raw[:pos]+segment+raw[end:]
 if slug=='calendario-fiscal':
  old='Este é um calendário das principais obrigações, não uma lista de todos os tributos. Confira o regime, a competência, os feriados e as prorrogações aplicáveis ao seu CNPJ.'
  assert old in raw
  raw=raw.replace(old,old+' DCTFWeb mensal: entrega até o último dia útil do mês seguinte; esse prazo não prorroga o pagamento da contribuição previdenciária. Há outras obrigações, como EFD-Reinf, conforme a atividade.')
 if slug in fontes and slug not in ('fim-escala-6x1','novo-limite-mei'):
  base=re.search(r'<p\b[^>]*><strong>Fontes oficiais e base legal:</strong>[\s\S]*?</p>',raw);assert base
  tag=base[0][:base[0].index('>')+1]
  content='<strong>Fontes oficiais e base legal:</strong><br>'+'<br>'.join(link(t,u) for t,u in fontes[slug])+'<br>Conteúdo conferido em <time datetime="2026-10-08">08/10/2026</time>. Os prazos gerais podem ter exceções e prorrogações; consulte a norma aplicável antes de decidir.'
  raw=raw[:base.start()]+tag+content+'</p>'+raw[base.end():]
 if raw!=before:files[path]=sync_ld(raw,slug)

# Reconstrói apenas as cópias de texto desde a base, com as mesmas substituições.
# Datas de atualização não são confundidas com datas de vencimento.
corr=json.loads((OUT/'correcoes.json').read_text(encoding='utf-8'))
summaries=corr['informacoes'][-3:-1]
for path in (ROOT/'conteudo').glob('*.md'):
 if path.name=='LEIA-ME.md':continue
 slug=path.stem.split('-',1)[1]
 if slug not in corr:continue
 raw=subprocess.check_output(['git','show','9b67307:conteudo/'+path.name],cwd=ROOT).decode('utf-8')
 for old,new in corr[slug]+summaries+extra.get(slug,[]):raw=raw.replace(old,new)
 if slug!='index':
  raw=re.sub(r'(?i)(atualizado em |consulta de |consultadas em )\d{2}/10/2026',lambda m:m[1]+'08/10/2026',raw)
  raw=re.sub(r'^(?:Base:|Conteúdo informativo, atualizado em).*$', '',raw,flags=re.M)
  raw+='\n\n## Fontes oficiais — consulta em 08/10/2026\n\n'+'\n'.join('- ['+t+']('+u+')' for t,u in fontes[slug])+'\n'
 if slug=='informacoes':
  raw=raw.replace('A reforma troca cinco tributos sobre o consumo por dois novos: a CBS, do governo federal, e o IBS, de estados e municípios. A troca acontece aos poucos e só termina em 2033.',extra['informacoes'][0][1])
  raw=raw.replace('São os dois novos impostos sobre o consumo. A CBS é do governo federal e substitui o PIS, a Cofins e o IPI. O IBS é dos estados e municípios e substitui o ICMS e o ISS.',corr['informacoes'][6][1])
  raw=raw.replace('PISCofinsIPI CBS ICMSISS IBS','PIS/Cofins → CBS · ICMS/ISS → IBS · IPI reduzido, com exceção da Zona Franca de Manaus; Imposto Seletivo separado')
  raw=raw.replace('Escolha um assunto. Cada página explica tudo em palavras simples, com valores e prazos atualizados em 01/10/2026.','Escolha um assunto. Veja regras vigentes, prazos e propostas em discussão, com a data de atualização indicada em cada página.')
 if slug=='pro-labore-e-lucros':raw=raw.replace('Imposto de RendaNãoTipo de retiradaLucros acima', 'Imposto de RendaSem IRRF mensal nessa regra; pode haver imposto mínimo anualTipo de retiradaLucros acima')
 if slug=='calendario-fiscal':raw=raw.replace('Confira o regime, a competência, os feriados e as prorrogações aplicáveis ao seu CNPJ.','Confira o regime, a competência, os feriados e as prorrogações aplicáveis ao seu CNPJ. DCTFWeb mensal: entrega até o último dia útil do mês seguinte; não prorroga o pagamento previdenciário. EFD-Reinf e outras obrigações variam conforme a atividade.')
 files[path]=raw
(OUT/'complementos.json').write_text(json.dumps({'mudancas':changes,'metadados':descriptions,'sincronizacaoMarkdown':'reconstruída da base 9b67307; vencimentos preservados'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for path,raw in files.items():path.write_text(raw,encoding='utf-8',newline='\n')
print(json.dumps({'arquivos':len(files),'complementos':len(changes)},ensure_ascii=False))
