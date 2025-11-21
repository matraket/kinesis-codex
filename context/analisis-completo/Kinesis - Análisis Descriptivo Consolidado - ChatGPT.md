# Informe ejecutivo de alcance — Aplicación web **Kinesis** (versión narrativa definitiva)

Este documento consolida, en una narración única y coherente, **las cuatro reuniones** del equipo (Adrián, Javier y Mariano) y los **tres análisis descriptivos individuales**. No introduce hipótesis ajenas a lo tratado: se limita a ordenar y desarrollar con profundidad todo lo que ya consta en las actas y en los análisis, priorizando primero las **capas de bajo nivel** (modelo de datos, gobierno y seguridad) y, después, las **funcionalidades operativas**, el **CMS/portal público**, la **capa de IA**, y por último **integraciones, despliegue y plan de implantación**.   

---

## 1) Fundamentos y enfoque de proyecto

Kinesis nace con un propósito doble: **profesionalizar la gestión interna de la escuela** (personas, oferta académica, calendario, cobros) y **orquestar—no sustituir—las automatizaciones existentes** mediante eventos y *webhooks*. Este enfoque evita rehacer lo que ya funciona y convierte a la aplicación en la **fuente de verdad** que dispara procesos externos cuando corresponde (notificaciones, emisión de certificados, etc.). La experiencia reciente del equipo en “by-coding” refuerza esta idea: el front puede beneficiarse de generación asistida, pero **los datos y la lógica** deben residir en una **base de datos relacional** bien diseñada para garantizar consistencia y escalabilidad.  

El consenso técnico registrado es claro: **WordPress** puede servir como satélite de contenidos en un entorno real, pero para Kinesis la **gestión funcional** debe permanecer en la **BD de la aplicación (PostgreSQL)**; el **frontend** puede ser estático y generado por la plataforma de *by-coding*, siempre que el contrato de datos sea sólido. Esta postura conjuga la practicidad (reutilizar materiales ya creados, por ejemplo, fichas y fotografías de profesores) con la **robustez** de un sistema a medida. En las reuniones se expusieron pros y contras de WordPress (rapidez de integración, ecosistema de plugins, pero también rendimiento y superficie de vulnerabilidad) y se acordó que, sin descartarlo para sincronización de catálogo, **el núcleo operativo y la información viva** deben quedar en Kinesis.   

Finalmente, a nivel metodológico se decidió trabajar con un **corpus documental exigente** (análisis, requisitos, historias/casos de uso, **ERD**, flujos y secuencias) y **tareas descompuestas** con su **PRD**. El objetivo no es “que el agente programe”, sino **dirigirlo** con arquitectura y convenciones claras, dado que las herramientas de *by-coding* tienden a mezclar capas si no se les impone un paradigma.  

---

## 2) Gobierno y seguridad: roles, perfiles y cumplimiento

Kinesis establece una **jerarquía de acceso estricta**. El **Director/Administrador** dispone de control integral: configuración, **cobros y pagos**, visión de **estadísticas** y **exportación de listados** de alumnos cuando proceda. El **Instructor** opera únicamente sobre **sus cursos y sus alumnos**, sin acceso a información financiera ni a exportaciones masivas. El **Estudiante** entra en un **portal privado** para revisar su **calendario** y el **estado de pagos**. Esta segmentación es operativa y legalmente prudente. Además, el sistema no mezcla “rol” con “menú”: los **perfiles de usuario** definen opciones concretas y pueden **asignarse de forma granular** a un usuario, incluso si su rol base es más limitado, siempre que la dirección lo justifique.   

En materia de **cumplimiento**, la aplicación **registra los consentimientos** imprescindibles: **uso de imágenes** y **autorización de comunicaciones** (p. ej., mensajería empresarial). Deliberadamente **se excluye** la recogida de **información médica** o de enfermedades para simplificar el marco LOPD y no exponer datos especialmente sensibles. 

---

## 3) Modelo de datos (entidades maestras y auxiliares) — **cada entidad por separado**

La **BD relacional (PostgreSQL)** es el corazón del sistema. El **ERD** definirá tablas, atributos y relaciones que reflejan con fidelidad la realidad de la escuela y que alimentarán, más adelante, la **planificación por IA**. A continuación se describen las entidades **de forma independiente**, tal y como se acordó, sin agrupar conceptos distintos.

**Estudiantes (Alumnos).**
Cada alumno cuenta con **ficha exhaustiva**: datos identificativos, **fechas de alta y baja**, y un **estado operativo** (activo, inactivo o con pagos al día/pendientes). La entidad se relaciona con asistencia, inscripciones y—para consulta del propio alumno—con su **histórico de clases** y su **situación de cobro**. 

**Instructores (Profesores).**
Además de su perfil personal/profesional, los profesores mantienen **restricciones de disponibilidad horaria**; este dato no es accesorio, es el insumo crítico que permitirá a la IA **construir cuadrantes** que respeten agenda y carga de trabajo. La relación con Cursos y Salas es directa: quién imparte y dónde.  

**Salas.**
El catálogo de salas define la **capacidad operativa** de la escuela y se **vincula a los horarios** para evitar solapes. Es una entidad explícita, no un atributo libre del curso, porque condiciona planificación y disponibilidad. 

**Programas.**
Recogen la **estructura curricular**: disciplinas, itinerarios y propuestas pedagógicas que luego se **publicarán** en el portal web. No son “texto decorativo”: su granularidad permite filtrar la oferta y explicar al público qué se imparte y con qué enfoque. 

**Cursos (y Actividades).**
La unidad operativa de impartición. Incluye **grupo**, **nivel**, **especialidad/estilo**, el **instructor** asignado, la **sala** y sus **horarios**. Es el punto donde confluyen calendario, asistencia y, si corresponde, consumo de bonos.  

**Modelos de negocio.**
Las **modalidades de servicio** (clases regulares, **grupos profesionales con criba**, **extraescolares**, bodas, etc.) viven como **entidad propia**, con **menú de gestión**; no son enumeraciones rígidas. Esta decisión preserva la **escalabilidad** cuando surjan nuevas líneas.  

**Bonos.**
La venta y uso de **packs de clases** requiere seguimiento: el sistema **descuenta automáticamente** cada sesión registrada y refleja al alumno su saldo. Bonos es una entidad distinta por su lógica de consumo, liquidación y comunicación de “lo que me queda”.  

**Clases privadas.**
Se gestionan de forma **independiente de Bonos** por su dinámica específica (p. ej., parejas de novios): agenda ad-hoc, condiciones particulares y, si procede, consumo vinculado a un paquete. 

**Especialidades (Estilos).**
Estilos como **clásico**, *street* o **contemporáneo** definen la naturaleza del Curso, mejoran el filtrado en la web y aportan precisión a la oferta académica. 

**Niveles.**
La progresión (iniciación, intermedio, avanzado) vive en su **propia entidad** para permitir consistencia entre cursos y una comunicación clara al alumno. 

**Precios y tarifas.**
Catálogo de **opciones de pago** (mensual, trimestral, bonos), consumido por la administración y por el CMS para presentar información clara y coherente al público. 

**Menús, opciones y perfiles.**
El **catálogo de menús/opciones** se **agrupa en perfiles**. Cada rol trae un **perfil por defecto**, pero la dirección puede **asignar perfiles específicos** a usuarios concretos cuando haya un caso de negocio. Esta separación (rol ≠ menú) evita soluciones rígidas y reduce excepciones ad-hoc. 

**Políticas y consentimientos.**
El sistema **captura** y **versiona** la aceptación de **uso de imágenes** y **comunicaciones**. Cualquier funcionalidad de mensajería se apoya en esta base para decidir a quién notificar y por qué canal. Queda fuera el dato sanitario. 

---

## 4) Operativa diaria: procesos transaccionales

La **gestión de inscripciones** admite el matiz real de la escuela: hay grupos abiertos y **grupos profesionales** con **criba**. En estos últimos, el alumno **solicita** plaza y la dirección **aprueba o rechaza**; el resultado **dispara notificaciones** por la arquitectura de automatización (N8N). El mismo cuidado se aplica a la **baja** de un curso o de la escuela, que actualiza calendario y estado económico cuando corresponda. 

El **control de asistencia** es responsabilidad del instructor y su registro alimenta otros módulos: consumo de bonos, progreso pedagógico y transparencia para el alumno, que consulta su **histórico** desde el portal. La **gestión de cobros** cubre la realidad del día a día: **cobros rápidos** (efectivo, **Bizum**) y **peticiones de pago** para que el alumno liquide desde su área privada. La dirección necesita una **vista de pagos atrasados** para intervenir a tiempo, sin convertir Kinesis en un ERP financiero.  

Para el **calendario y horarios**, la aplicación contempla **cierres y festivos** que, administrados centralmente, se **reflejan automáticamente** al alumno. Aun así, la realidad operativa exige flexibilidad: el profesor puede **anular un cierre** para impartir clase en un festivo, con efectos solo en su grupo. Las **vistas por profesor** y **por sala** facilitan la coordinación interna, y los cambios relevantes pueden **notificar** a los afectados.  

En comunicaciones, Kinesis se integra con **mensajería empresarial** (p. ej., **WhatsApp Business**) para **resúmenes de clase, avisos de cierres o recordatorios**, siempre respetando los consentimientos. Además, se **contempla** una **mensajería interna** alumno–instructor para dudas puntuales, funcional pero no invasiva, alineada con el principio de “no sustituir lo que ya existe fuera si funciona mejor”. 

Finalmente, la **emisión de certificados y diplomas** nace en Kinesis pero se tramita por **automación vía *webhook***: la app genera la orden y el sistema externo se encarga del documento y su envío, sin recargar la aplicación con procesos ajenos a su misión principal. **Notas pedagógicas** con posibilidad de **dictado y transcripción** completan el cuadro, aligera el trabajo del instructor y deja trazabilidad útil para conversaciones con familias o con el propio alumno. 

---

## 5) Portal público y CMS

Kinesis **alimenta directamente** el **portal público**: las mismas entidades que sostienen la operativa—**Programas, Instructores, Modelos de negocio y Precios**—publican su versión “de escaparate” con texto editorial y medios. En las reuniones se documentó que **existe material previo** (por ejemplo, fichas y **fotos de profesores** ya generadas) que puede **reaprovecharse** para la web, lo que acelera una primera versión demostrable. En paralelo, se dejó abierta la **sincronización** con WordPress por **API** cuando haya razones para ello (p. ej., aprovechar un equipo que ya domina su panel editorial). La clave es que la **fuente** sea Kinesis y que el **catálogo** no se “desdoble” en dos verdades.  

---

## 6) Capa de IA: del dato a la decisión

La **planificación anual** es la pieza diferencial. A partir de **programas, cursos, grupos, salas** y—sobre todo—de las **restricciones de disponibilidad** de los profesores, la IA **propone un cuadrante** que respeta condicionantes reales. No hablamos de “rellenar huecos”, sino de **conciliar recursos limitados** con objetivos pedagógicos y comerciales, y de hacerlo de forma explicable para que la dirección pueda **ajustar** y **aprobar**. Este módulo se apoya íntegramente en el **ERD** y en los datos vivos de Kinesis; por eso se ha insistido tanto en modelar bien desde el principio.  

Acompañan a esta funcionalidad un **asistente virtual** conectado a **RAG y datos operativos** para resolver preguntas frecuentes con contexto (“¿Cuántas clases me quedan?”, “¿Cuándo es el próximo festivo?”), y utilidades de **generación de contenido** que alivian a la dirección la redacción de descripciones y piezas promocionales. La **generación automática de galerías y vídeos** permite transformar material de eventos en recursos listos para web o redes. Sobre el **análisis de vídeo para entrenamiento en casa**, el equipo fue prudente: **con modelos generalistas no es viable** alcanzar calidad suficiente; se mantiene como **línea exploratoria** condicionada a la existencia de modelos específicos.   

---

## 7) Integraciones, arquitectura y despliegue

En integración, Kinesis **emite eventos**: aprobaciones de inscripciones, envíos de certificados, avisos de cierre o recordatorios, que **detonan flujos en N8N** u otras piezas ya desplegadas. En pagos, cubre el escenario **operativo** (efectivo, **Bizum** y **petición de pago** en el área privada), dejando fuera—por ahora—la **pasarela** avanzada para no sobredimensionar el alcance inicial. A nivel de infraestructura, se acordó **reutilizar el servidor** ya operativo (donde corre N8N) y **levantar un dominio** para la app, evitando fricción logística en esta fase.  

Desde el punto de vista del código, la experiencia con I-Studio mostró que el resultado **puede ser funcional pero estructuralmente caótico** si no se imponen reglas. Por ello, además del **ERD como contrato**, se fijará un **paradigma de capas** y convenciones de proyecto en los *prompts* de generación, de modo que controladores, modelos y vistas no se mezclen. Esta disciplina es la condición para que la aportación de IA acelere sin hipotecar el mantenimiento. 

---

## 8) Plan de implantación (orden lógico de construcción)

La construcción sigue un **orden natural** que minimiza retrabajo. **Primero**, se **consolida el modelo**: **ERD completo** y módulos de **roles, perfiles y consentimientos**, junto con semillas mínimas para operar (programas, especialidades, niveles, salas, instructores). **Después**, se desarrolla la **operativa núcleo**: inscripción con aprobación y baja, asistencia, calendario con cierres y **excepciones por profesor**, comunicaciones basadas en consentimiento, **cobros operativos** y **petición de pago**, y generación por *webhook* de certificados. Con ello ya existe un producto útil.

**A continuación**, se publica el **portal** con datos **provenientes del propio sistema** (programas, instructores, modelos de negocio y precios), reutilizando materiales existentes como las **fotos de profesores**. Si procede, se añade **sincronización** por API hacia WordPress. **Luego** se incorpora la **capa de IA**: primero el **asistente** y la **generación de contenido**, y, con el modelo estabilizado, la **planificación anual**. **Por último**, se refuerza la arquitectura del código generado por *by-coding*, se auditan flujos, y se prepara el guion del vídeo demostrativo.   

---

## 9) Alcance y exclusiones

Queda expresamente **fuera** el registro de **datos de salud**. No se contempla, en esta fase, la integración con **periféricos** (datáfonos, impresoras) ni una **pasarela** de pago avanzada; Kinesis cubre la **realidad operativa** y se **integra** con lo que ya existe vía *webhooks*. La aplicación **no reemplaza** los automatismos previos; los **orquesta**, y los potencia al aportarles una **fuente de datos fiable**, una **UI profesional** y—cuando los datos están maduros—una **capa de IA** capaz de proponer la organización óptima del tiempo y los recursos.  

---

### Cierre

Kinesis se define así como una **plataforma a medida** que **ordena el dato**, **normaliza los procesos** y **expone servicios** a las automatizaciones y al público, con una **capa inteligente** que convierte información en decisiones viables (calendarios anuales, asistentes y contenido). El relato anterior **no añade** supuestos externos: **amplía y detalla** lo ya recogido por el equipo, respeta las **entidades separadas**, y establece un **itinerario de construcción** que maximiza valor temprano sin comprometer el futuro del sistema.  
