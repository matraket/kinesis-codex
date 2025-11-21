# Análisis Descriptivo Consolidado - Aplicación Web Kinesis

Este documento presenta el análisis descriptivo exhaustivo y completo de todas las funcionalidades que debe contemplar la aplicación web a medida para la escuela de danza Kinesis. Este análisis consolida las contribuciones de los tres miembros del equipo (Adrián, Javier y Mariano), integrando todas las funcionalidades propuestas y organizando el contenido en bloques lógicos desde los componentes de bajo nivel hasta las funcionalidades de alto nivel.

---

## 1. Marco Estratégico y Enfoque del Proyecto

### 1.1 Visión General del Proyecto

El proyecto Kinesis tiene como objetivo desarrollar una **aplicación web a medida** que profesionalice la gestión administrativa y operacional de la escuela de danza ficticia Kinesis. Este desarrollo representa la continuación lógica y natural del proyecto previamente completado, en el cual se diseñó e implementó una arquitectura completa de automatizaciones agénticas basada en N8N y el agente conversacional ArIA.

La particularidad fundamental de esta fase es que **la aplicación no sustituye las automatizaciones existentes, sino que las complementa y orquesta**. La aplicación actuará como capa de interacción y gestión de datos, mientras que las acciones realizadas dentro de la aplicación podrán desencadenar flujos de trabajo predefinidos en el sistema de automatización a través de webhooks, creando así un ecosistema integrado y coherente.

### 1.2 Estrategia de Documentación y Desarrollo

Antes de cualquier línea de código, el proyecto se fundamenta en la elaboración de un **corpus documental profesional impecable**. Esta documentación exhaustiva es crucial para garantizar que la generación de la solución mediante asistentes de desarrollo (herramientas de B-coding) sea funcional desde la primera iteración y minimice la ambigüedad en los requisitos.

El corpus documental completo debe incluir:

- **Análisis descriptivo exhaustivo** de todas las funcionalidades (este documento)
- **Requisitos funcionales** detallados de cada componente del sistema
- **Requisitos no funcionales** que definan rendimiento, seguridad, escalabilidad y usabilidad
- **Historias de usuario** que capturen las necesidades desde la perspectiva de cada tipo de usuario
- **Casos de uso** que describan los flujos de interacción completos
- **Diagramas UML**: diagramas de casos de uso y diagramas de secuencia
- **Diagramas de flujo** que visualicen los procesos operativos clave
- **Diagrama Entidad-Relación (ER)** que especifique la estructura completa de la base de datos, tablas, atributos, tipos de datos, restricciones y relaciones que definen la lógica del negocio

### 1.3 Metodología de Desarrollo Iterativo

Dada la ambición y complejidad del proyecto, la implementación se abordará mediante la **descomposición del proyecto en tareas simples e individuales**. Para cada tarea se generará un Documento de Requisitos de Producto (PRD) específico, lo que permitirá la implementación iterativa sobre el mismo código base sin romper la funcionalidad existente.

Este enfoque iterativo asegura:
- **Validación incremental** de cada componente antes de avanzar
- **Reducción del riesgo** de errores acumulativos
- **Flexibilidad** para ajustar requisitos basándose en aprendizajes
- **Mantenimiento** de un código base estable y funcional en todo momento

### 1.4 Tecnologías Base y Stack Tecnológico

La aplicación utilizará una base de datos **PostgreSQL** como sistema de gestión de datos principal. Esta elección se fundamenta en:

- **Robustez y madurez** del sistema
- **Capacidad de integración directa** con los flujos de N8N mediante nodos SQL
- **Soporte para lógica compleja** a nivel de base de datos (procedimientos almacenados, triggers, vistas)
- **Escalabilidad** para un crecimiento futuro de la escuela
- **Compatibilidad** con herramientas de desarrollo modernas

---

## 2. Arquitectura de Datos y Modelo de Base de Datos

### 2.1 Diseño de la Base de Datos

La estructura de la base de datos debe ser diseñada con una **lógica relacional normalizada**, garantizando la integridad referencial y minimizando la redundancia de datos. El diagrama entidad-relación debe especificar:

- **Todas las tablas** del sistema con sus nombres descriptivos
- **Todos los campos** de cada tabla con nombres, tipos de datos, longitudes y restricciones
- **Claves primarias** y su estrategia de generación (secuencias, UUIDs, etc.)
- **Claves foráneas** y las relaciones que establecen
- **Índices** necesarios para optimizar consultas frecuentes
- **Restricciones de integridad** (unique, not null, check, etc.)
- **Relaciones** (uno a uno, uno a muchos, muchos a muchos) con sus cardinalidades

### 2.2 Entidades Maestras del Sistema

Las entidades maestras constituyen el núcleo informacional del sistema y deben ser gestionadas de forma independiente con sus propios módulos de administración.

#### 2.2.1 Entidad: Estudiantes (Alumnos)

La entidad Estudiantes almacena toda la información relevante de los alumnos de la escuela.

**Información Personal Básica:**
- Datos de identificación: nombre completo, documento de identidad, fecha de nacimiento
- Información de contacto: dirección completa (calle, número, código postal, ciudad, provincia), teléfono de contacto principal, teléfono alternativo, correo electrónico principal, correo electrónico alternativo
- Fotografía del alumno para identificación visual en el sistema

**Información de Contacto de Emergencia:**
- Nombre completo del contacto de emergencia
- Relación con el alumno (padre, madre, tutor legal, familiar, otro)
- Teléfono de contacto de emergencia
- Correo electrónico del contacto de emergencia

**Información Administrativa:**
- **Fecha de alta**: registro de cuándo el alumno se inscribió en la escuela
- **Fecha de baja**: si el alumno se da de baja, se registra la fecha y el motivo
- **Estado del alumno**: categorización del estado actual
  - Activo: alumno inscrito y asistiendo regularmente
  - Inactivo: alumno que ha pausado su participación pero mantiene la matrícula
  - Con pagos pendientes: alumno con cuotas atrasadas
  - De baja: alumno que ha finalizado su relación con la escuela
- **Historial de estados**: registro temporal de cambios de estado para análisis

**Aceptación de Políticas Legales:**
El sistema debe registrar el consentimiento explícito del alumno o su tutor legal para:
- **Uso de imágenes**: autorización para fotografiar y grabar al alumno en eventos, clases y actividades, y el uso de estas imágenes para fines promocionales en redes sociales, web corporativa y materiales de marketing
- **Comunicaciones**: consentimiento para recibir comunicaciones a través de sistemas de mensajería empresarial (WhatsApp Business, SMS) con información sobre clases, cierres, eventos y promociones
- **Tratamiento de datos**: aceptación de la política de privacidad y tratamiento de datos personales según normativa LOPD/GDPR

**Nota importante sobre información médica:**
Se ha excluido del alcance la gestión de información médica o de enfermedades del alumno para simplificar el cumplimiento de las complejas implicaciones de la normativa de protección de datos en materia de datos sensibles de salud.

**Vinculación con otras entidades:**
- Relación con Cursos/Actividades: inscripciones actuales e históricas
- Relación con Bonos: bonos de clases adquiridos
- Relación con Pagos: registro de cuotas y transacciones
- Relación con Asistencias: control de presencia en clases
- Relación con Grupos Profesionales: si aplica, participación en grupos selectos

#### 2.2.2 Entidad: Instructores (Profesores)

La entidad Instructores gestiona toda la información relacionada con el cuerpo docente de la escuela.

**Información Personal y Profesional:**
- Datos de identificación: nombre completo, documento de identidad, fecha de nacimiento
- Información de contacto: dirección completa, teléfono de contacto, correo electrónico profesional
- Fotografía profesional del instructor
- Biografía profesional: trayectoria, especializaciones, logros, certificaciones
- Curriculum vitae: formación académica y experiencia profesional relevante

**Especialidades y Competencias:**
- Lista de estilos de baile que el instructor está cualificado para impartir (danza clásica, street dance, contemporáneo, flamenco, salsa, bachata, etc.)
- Niveles que puede impartir (iniciación, intermedio, avanzado, profesional)
- Certificaciones y títulos oficiales en cada especialidad

**Disponibilidad y Restricciones Horarias:**
Esta es una funcionalidad **crucial para la planificación automática del calendario anual**:
- **Disponibilidad general semanal**: Para cada día de la semana, el instructor define sus franjas horarias disponibles (ej: Lunes de 10:00 a 14:00 y de 17:00 a 21:00)
- **Restricciones específicas**: Fechas y horarios concretos en los que el instructor no está disponible
  - Vacaciones personales
  - Compromisos externos (actuaciones, formaciones, eventos)
  - Ausencias médicas o personales
- **Preferencias horarias**: Opcionalmente, el instructor puede indicar preferencias de horario que el sistema tendrá en cuenta en la planificación

Esta información de disponibilidad alimentará directamente el motor de IA que genera la planificación anual del cuadrante de clases.

**Información Contractual y Administrativa:**
- Fecha de inicio de colaboración con la escuela
- Tipo de relación contractual (contratado, autónomo, colaborador externo)
- Salario o tarifa por hora/clase
- Cuenta bancaria para pagos (IBAN)

**Vinculación con otras entidades:**
- Relación con Cursos/Actividades: cursos que imparte
- Relación con Salas: salas donde habitualmente imparte clases
- Relación con Horarios: sesiones asignadas en el calendario
- Relación con Notas Pedagógicas: notas sobre el progreso de alumnos

#### 2.2.3 Entidad: Salas

La entidad Salas registra y gestiona los espacios físicos disponibles en la escuela para la impartición de clases y actividades.

**Información de la Sala:**
- Identificador único de sala (código o nombre): ej. "Sala A", "Estudio Principal", "Sala Multiusos"
- Nombre descriptivo de la sala
- Capacidad máxima: número máximo de alumnos que puede albergar simultáneamente
- Superficie en metros cuadrados
- Características especiales:
  - Tipo de suelo (parquet, linóleo, moqueta, otro)
  - Presencia de espejos (completos, parciales, ninguno)
  - Sistemas de sonido disponibles (equipo de música, micrófonos, altavoces)
  - Barras de ballet (fijas, móviles)
  - Aire acondicionado / calefacción
  - Ventanas y luz natural
  - Sistema de ventilación
- Fotografías de la sala para visualización

**Idoneidad para Disciplinas:**
Indicación de qué tipos de baile son más apropiados para cada sala según sus características (ej: una sala con barras de ballet es ideal para danza clásica)

**Estado y Disponibilidad:**
- Estado operativo (disponible, en mantenimiento, fuera de servicio)
- Horario de disponibilidad general (si alguna sala tiene restricciones horarias específicas)

**Vinculación con otras entidades:**
- Relación con Cursos/Actividades: actividades que se imparten en esta sala
- Relación con Horarios: sesiones programadas en esta sala

#### 2.2.4 Entidad: Programas

La entidad Programas define la estructura curricular general de las disciplinas de baile ofrecidas por la escuela. Un programa es una agrupación conceptual de múltiples cursos relacionados.

**Definición del Programa:**
- Nombre del programa: ej. "Ballet Clásico Completo", "Escuela de Street Dance", "Formación en Danza Contemporánea"
- Descripción general del programa: objetivos pedagógicos, filosofía, metodología
- Imagen representativa del programa

**Estructura del Programa:**
- Niveles que componen el programa: iniciación, básico, intermedio, avanzado, profesional
- Duración estimada para completar el programa completo
- Requisitos previos: si es necesario superar niveles anteriores o tener experiencia previa

**Información para Web Corporativa (CMS):**
Como la aplicación también funciona como CMS para la web pública, los programas deben incluir:
- Descripción extensa y detallada para la web pública
- Objetivos de aprendizaje claramente definidos
- Galería de imágenes: fotografías de alumnos en clases del programa (con consentimiento)
- Videos promocionales del programa
- Testimonios de alumnos que han completado el programa
- Copyright e información de autoría de contenidos audiovisuales

**Vinculación con otras entidades:**
- Relación con Cursos: un programa agrupa múltiples cursos
- Relación con Especialidades: un programa puede estar asociado a una o varias especialidades
- Relación con Instructores: instructores especializados en impartir cursos de este programa

#### 2.2.5 Entidad: Cursos y Actividades

La entidad Cursos representa las actividades docentes concretas que se ofertan en la escuela. Un curso es la unidad operativa real de enseñanza.

**Definición del Curso:**
- Nombre del curso: ej. "Ballet Clásico - Nivel Intermedio - Grupo Martes/Jueves Tarde"
- Descripción del curso: contenido específico, objetivos, metodología
- Código interno del curso para gestión administrativa

**Características Académicas:**
- **Especialidad**: a qué estilo de baile pertenece (danza clásica, street, contemporáneo, etc.)
- **Nivel**: iniciación, intermedio, avanzado, profesional
- **Programa al que pertenece**: vinculación con el programa curricular general
- **Modelo de negocio**: a qué categoría de servicio corresponde (clase regular, grupo profesional, extraescolar, bono, boda)

**Planificación del Curso:**
- Fecha de inicio del curso
- Fecha de finalización del curso (si aplica)
- Número de sesiones totales previstas en el curso
- Duración de cada sesión en minutos

**Configuración Operativa:**
- **Sala asignada**: dónde se imparte el curso habitualmente
- **Instructor titular**: profesor responsable del curso
- **Instructor suplente**: profesor que puede sustituir en ausencias
- **Capacidad**: número mínimo y máximo de alumnos

**Tarificación:**
- Precio de matrícula/inscripción (si aplica)
- Cuota mensual
- Cuota trimestral (si aplica)
- Cuota anual (si aplica)
- Descuentos disponibles (pronto pago, familias numerosas, múltiples cursos, etc.)

**Estado del Curso:**
- Abierto a inscripciones
- Plazas limitadas
- Completo (sin plazas disponibles)
- Cerrado (no acepta inscripciones)
- Finalizado
- Cancelado

**Vinculación con otras entidades:**
- Relación con Programa: pertenece a un programa curricular
- Relación con Especialidad: define su disciplina
- Relación con Nivel: define su dificultad
- Relación con Modelo de Negocio: define su categoría comercial
- Relación con Instructor: profesor que lo imparte
- Relación con Sala: espacio donde se imparte
- Relación con Estudiantes: alumnos inscritos
- Relación con Horarios: sesiones programadas en el calendario

#### 2.2.6 Entidad: Especialidades

La entidad Especialidades categoriza los diferentes estilos o disciplinas de baile que ofrece la escuela.

**Definición de la Especialidad:**
- Nombre de la especialidad: ej. "Danza Clásica (Ballet)", "Street Dance", "Danza Contemporánea", "Flamenco", "Salsa", "Bachata", "Hip Hop", "Jazz"
- Descripción de la especialidad: historia, características, técnicas principales
- Imagen representativa de la especialidad

**Información para Web Corporativa (CMS):**
- Descripción extensa para publicación en la web
- Galería de imágenes de esta especialidad
- Videos demostrativos o de presentación
- Copyright de contenidos audiovisuales

**Vinculación con otras entidades:**
- Relación con Cursos: cursos que pertenecen a esta especialidad
- Relación con Programas: programas que incluyen esta especialidad
- Relación con Instructores: profesores especializados en esta disciplina

#### 2.2.7 Entidad: Niveles

La entidad Niveles categoriza la progresión de dificultad o experiencia requerida para los cursos.

**Definición del Nivel:**
- Nombre del nivel: ej. "Iniciación", "Básico", "Intermedio", "Avanzado", "Profesional", "Perfeccionamiento"
- Descripción del nivel: qué se espera que el alumno sepa al ingresar a este nivel y qué logrará al completarlo
- Requisitos previos: conocimientos o habilidades necesarias
- Orden/secuencia: posición en la progresión curricular (1, 2, 3, etc.)

**Criterios de Evaluación:**
- Competencias que se evalúan para determinar si un alumno está preparado para pasar a este nivel
- Métodos de evaluación (observación en clase, examen práctico, coreografía, etc.)

**Vinculación con otras entidades:**
- Relación con Cursos: cursos de este nivel
- Relación con Programas: niveles que componen un programa

#### 2.2.8 Entidad: Modelos de Negocio

La entidad Modelos de Negocio recoge las diferentes modalidades de servicio que ofrece la escuela. Esta es una entidad fundamental que **debe ser configurable como entidad independiente en la base de datos** con su propio menú de gestión, en lugar de ser un simple campo enumerado. Esto facilita la escalabilidad y la adición de nuevos modelos de negocio sin modificar el esquema de base de datos.

**Modelos de Negocio Definidos:**

**1. Clases Regulares**
- Clases grupales estándar que se imparten durante las tardes y eventuales mañanas de fin de semana
- Dirigidas al público general (niños, adolescentes, adultos)
- Inscripción abierta a cualquier persona sin requisitos de nivel previo (excepto restricciones por edad o nivel específico del curso)
- Pago mediante cuota mensual, trimestral o anual
- Modalidad de negocio principal de la escuela

**2. Grupos Profesionales / Tecnificación**
- Grupos selectos para alumnos con alto nivel y compromiso
- Se imparten generalmente en horarios de mañana (ej: 9:00-14:00) para alumnos que buscan profesionalizarse
- **Requieren proceso de selección y aprobación** por parte de la dirección
  - El alumno solicita inscripción
  - El director/instructor evalúa el nivel técnico y la dedicación del alumno
  - Se aprueba o rechaza la inscripción
- Suelen tener tarifas diferenciadas (a menudo más altas por la intensidad y calidad de la formación)
- Enfocados a formación intensiva para competencias, audiciones, carrera profesional

**3. Clases Extraescolares**
- Actividades ofrecidas como extraescolar en colegios e institutos
- Coordinación con centros educativos externos
- Horarios específicos fuera del horario lectivo escolar
- Gestión de inscripciones que puede involucrar al colegio como intermediario
- Facturación y cobros que pueden ser directos o a través del centro educativo

**4. Bonos de Clases Privadas**
- Packs de clases privadas o semi-privadas (ej: bono de 5, 10 o 20 clases)
- Permiten flexibilidad de horarios según disponibilidad del instructor y alumno
- Pago por adelantado del paquete completo de clases
- **Seguimiento del consumo**: el sistema debe registrar cuántas clases del bono ha consumido el alumno y cuántas le quedan
- **Deducción automática**: al registrar asistencia a una clase privada, el sistema debe descontar automáticamente una clase del bono activo del alumno
- Pueden tener fecha de caducidad (ej: válido por 6 meses desde la compra)
- Aplicable para cualquier especialidad y nivel

**5. Clases para Bodas / Eventos**
- Clases especializadas para parejas que desean preparar el baile de su boda
- También pueden ser clases para grupos que preparan coreografías para eventos especiales (cumpleaños, celebraciones, etc.)
- Modalidad de pago por sesiones o por paquete
- Normalmente tiene duración limitada y objetivo específico
- Requiere gestión de calendario flexible y personalización del contenido

**Características de Cada Modelo:**
Cada modelo de negocio debe tener asociado:
- Nombre descriptivo del modelo
- Descripción de sus características
- Reglas de inscripción (directa, requiere aprobación, requiere evaluación previa)
- Estructura de precios (mensual, trimestral, anual, por sesión, por bono)
- Restricciones especiales (edad, nivel, disponibilidad horaria)
- Posibilidad de uso de bonos (si aplica)

**Vinculación con otras entidades:**
- Relación con Cursos: cada curso está asociado a un modelo de negocio
- Relación con Tarifas: cada modelo tiene su estructura de precios

#### 2.2.9 Entidad: Bonos

La entidad Bonos gestiona específicamente los packs de clases privadas o semi-privadas que los alumnos pueden adquirir.

**Definición del Bono:**
- Nombre del bono: ej. "Bono 10 clases privadas", "Pack Bodas - 5 sesiones"
- Descripción del bono: qué incluye, para qué es adecuado
- Número total de clases/sesiones que incluye el bono
- Duración de cada sesión (si es fija)
- Precio total del bono
- Precio por clase individual (para comparación)
- Descuento porcentual respecto al precio unitario sin bono

**Condiciones del Bono:**
- Especialidades aplicables: ¿en qué disciplinas se puede usar el bono? (todas, danza clásica solamente, street dance solamente, etc.)
- Niveles aplicables: ¿para qué niveles es válido el bono?
- Instructores disponibles: ¿con qué instructores se puede usar el bono?
- Caducidad: fecha límite para consumir todas las clases del bono (ej: 6 meses, 1 año, sin caducidad)

**Vinculación con otras entidades:**
- Relación con Estudiantes: alumnos que han adquirido bonos

#### 2.2.10 Entidad: Bonos Adquiridos por Estudiantes

Esta es una entidad relacional que conecta a los estudiantes con los bonos que han comprado y gestiona el seguimiento de su consumo.

**Información de la Compra:**
- ID único de compra de bono
- Estudiante que compró el bono
- Tipo de bono adquirido (referencia a la entidad Bonos)
- Fecha de compra
- Precio pagado (puede diferir del precio estándar si hubo promoción)
- Número de clases iniciales del bono
- **Número de clases restantes**: campo que se actualiza dinámicamente cada vez que el alumno consume una clase
- Estado del bono:
  - Activo: bono vigente con clases disponibles
  - Consumido: todas las clases han sido utilizadas
  - Caducado: venció el plazo sin consumir todas las clases
  - Cancelado: bono anulado (con devolución o sin ella)
- Fecha de caducidad calculada
- Fecha de consumo total (cuando se agotó el bono)

**Seguimiento de Consumo:**
El sistema debe llevar un registro detallado de cada vez que el alumno usa una clase del bono:
- Fecha y hora de la clase consumida
- Instructor que impartió la clase
- Especialidad y contenido de la clase
- Duración de la sesión
- Observaciones (si las hay)

**Deducción Automática:**
Cuando el instructor registra la asistencia de un alumno a una clase privada, el sistema debe:
1. Identificar el bono activo del alumno (si tiene varios, según las reglas de negocio: primero el más antiguo, o el más próximo a caducar)
2. Verificar que el bono tiene clases disponibles
3. Deducir automáticamente una clase del bono
4. Actualizar el campo "clases restantes"
5. Si el bono llega a cero clases, cambiar su estado a "Consumido"
6. Enviar una notificación al alumno informando de las clases restantes

**Vinculación con otras entidades:**
- Relación con Estudiante: propietario del bono
- Relación con Bono: tipo de bono comprado
- Relación con Pagos: transacción de compra del bono
- Relación con Asistencias: clases privadas registradas que consumen el bono

#### 2.2.11 Entidad: Precios y Tarifas

La entidad Tarifas centraliza la configuración de las opciones de pago y precios de los diferentes servicios de la escuela.

**Estructura de Tarifas:**
- Nombre de la tarifa: ej. "Mensualidad Clases Regulares Adultos", "Trimestre Clases Regulares Infantil", "Tarifa Grupo Profesional"
- Descripción de qué incluye la tarifa
- Modelo de negocio al que aplica
- Curso(s) específico(s) al que aplica (o aplicación general)
- Nivel al que aplica (si es relevante)

**Opciones de Pago:**
- **Mensualidad**: pago mes a mes
  - Precio mensual estándar
  - Descuentos por domiciliación bancaria
  - Descuentos por pronto pago
- **Trimestralidad**: pago de 3 meses por adelantado
  - Precio trimestral
  - Ahorro respecto a pagar 3 mensualidades separadas
- **Anualidad**: pago del curso completo por adelantado
  - Precio anual
  - Ahorro respecto a pagar 12 mensualidades

**Descuentos Configurables:**
- Familias numerosas (con certificado)
- Inscripción múltiple (alumno inscrito en varios cursos simultáneamente)
- Hermanos inscritos en la escuela
- Descuento por antigüedad (alumnos con X años en la escuela)
- Promociones temporales
- Descuentos para grupos corporativos o asociaciones

**Recargos:**
- Matrícula inicial (si aplica)
- Seguro de responsabilidad civil (si se cobra separadamente)
- Material didáctico (zapatillas, vestuario para espectáculos)

**Vinculación con otras entidades:**
- Relación con Modelos de Negocio: cada tarifa corresponde a un modelo
- Relación con Cursos: tarifas aplicables a cada curso
- Relación con Estudiantes: aplicación de descuentos según perfil del alumno

### 2.3 Entidades de Gestión Operativa

Estas entidades gestionan las operaciones diarias de la escuela.

#### 2.3.1 Entidad: Inscripciones y Solicitudes de Inscripción

Esta entidad gestiona tanto las inscripciones directas como las solicitudes que requieren aprobación.

**Información de la Solicitud/Inscripción:**
- ID único de solicitud
- Estudiante solicitante
- Curso al que desea inscribirse
- Fecha de la solicitud
- Estado de la solicitud:
  - Pendiente de revisión
  - Aprobada
  - Rechazada
  - Inscrito (para inscripciones directas)
  - Cancelada
- Motivo de rechazo (si aplica)
- Comentarios del estudiante (ej: motivación para grupos profesionales)
- Notas internas del administrador/instructor

**Flujo de Aprobación:**
Para cursos que requieren selección (como grupos profesionales):
1. El alumno envía una solicitud de inscripción
2. El sistema notifica al administrador/director
3. El administrador revisa la solicitud (puede consultar con el instructor)
4. El administrador aprueba o rechaza la solicitud con comentarios
5. El sistema envía notificación al alumno con la decisión
   - Si se aprueba: el alumno queda inscrito en el curso
   - Si se rechaza: se le informa el motivo y se le sugieren alternativas

**Integración con Automatizaciones:**
Este proceso debe disparar webhooks hacia N8N para:
- Enviar notificaciones automáticas al alumno sobre el estado de su solicitud
- Generar documentos de confirmación de inscripción
- Actualizar registros en otros sistemas (si aplica)

**Vinculación con otras entidades:**
- Relación con Estudiante: solicitante
- Relación con Curso: curso solicitado
- Relación con Usuario (Administrador): quien aprueba/rechaza

#### 2.3.2 Entidad: Bajas de Cursos

Gestiona las solicitudes de baja de un curso o de la escuela por parte de los alumnos.

**Información de la Baja:**
- ID único de solicitud de baja
- Estudiante que solicita la baja
- Curso del que se da de baja (o baja total de la escuela)
- Fecha de solicitud de baja
- Fecha efectiva de baja (puede ser diferente según políticas)
- Motivo de la baja:
  - Problemas de horario
  - Razones económicas
  - Insatisfacción con el servicio
  - Problemas de salud
  - Cambio de ciudad/mudanza
  - Otros (especificar)
- Comentarios adicionales del alumno
- Estado de la baja:
  - Solicitada
  - Aprobada
  - Procesada (baja efectiva)
  - Cancelada (el alumno decidió no darse de baja)

**Gestión de Pagos Pendientes:**
- Si el alumno tiene pagos pendientes, la baja puede quedarse en estado "Pendiente" hasta que se regularice la situación
- Cálculo prorrateado de cuotas si aplica (según política de devoluciones)

**Integración con Automatizaciones:**
Disparar webhooks para:
- Notificar al alumno la confirmación de baja
- Generar certificado de asistencia/finalización si corresponde
- Actualizar estado del alumno en el sistema

**Vinculación con otras entidades:**
- Relación con Estudiante: alumno que se da de baja
- Relación con Curso: curso del que se da de baja
- Relación con Pagos: verificación de pagos pendientes

#### 2.3.3 Entidad: Control de Asistencia

Funcionalidad clave que permite a los instructores registrar la asistencia de los alumnos a sus clases.

**Registro de Asistencia:**
- ID único de registro
- Sesión de clase específica (fecha, hora, curso)
- Instructor que registra la asistencia
- Estudiante
- Estado de asistencia:
  - Presente
  - Ausente
  - Ausente justificada (con justificante médico, laboral, etc.)
  - Llegó tarde
- Hora de llegada (si es relevante)
- Observaciones del instructor sobre la participación del alumno en esa sesión

**Historial de Asistencia:**
Los alumnos pueden consultar desde su portal privado:
- Porcentaje de asistencia general y por curso
- Listado de clases a las que asistió y faltó
- Tendencia de asistencia (gráfico temporal)
- Alertas si el porcentaje de asistencia es bajo

**Uso en Bonos:**
Cuando un alumno con bono asiste a una clase privada, el sistema:
- Registra la asistencia
- Deduce automáticamente una clase del bono activo correspondiente
- Actualiza el contador de clases restantes del bono

**Generación de Informes:**
El instructor y el administrador pueden generar informes de asistencia:
- Por curso (porcentaje de asistencia promedio del grupo)
- Por alumno (historial detallado)
- Por rango de fechas
- Alumnos con baja asistencia (para seguimiento)

**Vinculación con otras entidades:**
- Relación con Horario/Sesión: sesión de clase específica
- Relación con Estudiante: alumno cuya asistencia se registra
- Relación con Instructor: profesor que toma asistencia
- Relación con Bonos Adquiridos: si aplica, para deducción de clases

#### 2.3.4 Entidad: Pagos y Cobros

Módulo robusto para la gestión de cuotas, cobros y el estado financiero de los alumnos.

**Registro de Pagos:**
- ID único de pago/transacción
- Estudiante que realiza el pago
- Concepto del pago:
  - Cuota mensual de curso específico
  - Cuota trimestral
  - Cuota anual
  - Compra de bono
  - Matrícula/inscripción
  - Otros conceptos (material, eventos, etc.)
- Curso al que corresponde el pago (si aplica)
- Importe total del pago
- Descuentos aplicados (con detalle)
- Importe neto a pagar
- Fecha de emisión del recibo/factura
- Fecha de vencimiento del pago
- Fecha de pago efectivo (cuando se cobra)
- Método de pago:
  - Efectivo
  - Transferencia bancaria
  - BIZUM
  - Domiciliación bancaria (cargo automático)
  - Tarjeta de crédito/débito
  - Pasarela de pago online (Stripe, Redsys, etc.)
- Estado del pago:
  - Pendiente
  - Pagado
  - Atrasado (venció y no se ha cobrado)
  - Parcialmente pagado
  - Anulado/devuelto
- Número de factura/recibo
- Archivo adjunto de comprobante de pago (si el alumno lo sube)

**Cobros Rápidos:**
El administrador debe poder realizar **cobros rápidos** para situaciones en persona:
- El alumno llega a recepción y quiere pagar en efectivo o con BIZUM
- El sistema permite seleccionar al alumno, el concepto, el importe y registrar el cobro inmediatamente
- Se genera un recibo automáticamente que se puede imprimir o enviar por correo electrónico

**Petición de Pago al Alumno:**
Funcionalidad esencial:
- El administrador puede **enviar una petición de pago** al alumno
- El alumno recibe una notificación (email, WhatsApp Business) con un enlace
- Al acceder al enlace, el alumno puede:
  - Ver el detalle del pago pendiente
  - Liquidar la cuota desde su zona privada mediante pasarela de pago online
- El sistema actualiza automáticamente el estado del pago cuando se completa la transacción

**Gestión de Pagos Atrasados:**
- Vista dedicada para el administrador con todos los pagos atrasados
- Filtros por alumno, curso, antigüedad del atraso
- Posibilidad de envío de recordatorios automáticos
- Alertas visuales en la ficha del alumno si tiene pagos pendientes

**Generación de Documentos Financieros:**
- Recibos de pago
- Facturas (con datos fiscales de la escuela y del alumno/tutor)
- Certificados de pagos realizados (para deducciones fiscales si aplica)

**Integración con Automatizaciones:**
Disparar webhooks para:
- Envío automático de recibos por email
- Recordatorios de pagos próximos a vencer
- Alertas de pagos atrasados
- Confirmaciones de pago recibido

**Vinculación con otras entidades:**
- Relación con Estudiante: alumno que realiza el pago
- Relación con Curso: curso asociado al pago
- Relación con Tarifas: tarifa aplicada
- Relación con Bonos Adquiridos: si el pago es por compra de bono

#### 2.3.5 Entidad: Emisión de Documentos (Certificados y Diplomas)

Utilidad para la generación y envío de documentación oficial a los alumnos.

**Tipos de Documentos:**
- **Certificados de asistencia**: documento que acredita que el alumno ha asistido a un curso durante un período específico
  - Nombre del alumno
  - Curso(s) realizado(s)
  - Período de asistencia (fecha de inicio y fin)
  - Porcentaje de asistencia
  - Firma del director/instructor
  - Sello de la escuela
- **Diplomas de finalización de curso**: documento que certifica la finalización satisfactoria de un curso o programa
  - Nombre del alumno
  - Curso/Programa completado
  - Nivel alcanzado
  - Fecha de finalización
  - Calificación o evaluación (si aplica)
  - Firma del director/instructor
  - Sello de la escuela

**Proceso de Emisión:**
- El administrador selecciona al alumno y el tipo de documento a emitir
- El sistema precarga los datos del alumno y del curso desde la base de datos
- Se puede personalizar el texto del documento si es necesario
- Se genera el documento en formato PDF con el diseño corporativo de la escuela
- **Integración con automatizaciones**: la emisión dispara un webhook hacia N8N que puede:
  - Enviar el documento por correo electrónico al alumno
  - Registrar la emisión en un log
  - Archivar el documento en un repositorio externo (Google Drive, Dropbox)
  - Enviar notificación por WhatsApp Business con enlace al documento

**Plantillas de Documentos:**
El sistema debe permitir:
- Configuración de plantillas personalizadas para cada tipo de documento
- Inclusión de logotipo de la escuela, firma digital, sello
- Variables dinámicas que se reemplacen automáticamente (nombre del alumno, fecha, etc.)

**Registro de Documentos Emitidos:**
- Historial de todos los documentos emitidos a cada alumno
- Fecha de emisión
- Tipo de documento
- Estado (emitido, enviado, recibido por el alumno)
- Posibilidad de reenvío si el alumno lo solicita

**Vinculación con otras entidades:**
- Relación con Estudiante: destinatario del documento
- Relación con Curso: curso que se certifica
- Relación con Asistencia: datos de asistencia para el certificado

### 2.4 Entidades de Planificación Temporal

#### 2.4.1 Entidad: Calendario General de la Escuela

Gestiona las fechas especiales, cierres y festivos que afectan a toda la escuela.

**Festivos Nacionales y Locales:**
- Importación automática de festivos nacionales de España
- Festivos locales de la Comunidad Valenciana y de Muro de Alcoy
- Posibilidad de agregar festivos manualmente

**Cierres de la Escuela:**
El administrador puede crear períodos de cierre:
- **Vacaciones de Navidad**: fechas de inicio y fin del cierre navideño
- **Vacaciones de Semana Santa**: fechas de cierre por Semana Santa
- **Vacaciones de Verano**: período estival sin actividad
- **Cierres puntuales**: días específicos por eventos, mantenimiento, formación del profesorado, etc.
- Descripción del motivo del cierre

**Visualización en Calendarios:**
- Estos cierres se reflejan automáticamente en el calendario visible para los alumnos
- Las clases que caen en fechas de cierre aparecen marcadas como "Suspendida por cierre de escuela"
- Se actualiza el contador de clases totales del curso si se cancela una sesión

**Vinculación con otras entidades:**
- Relación con Horarios: las sesiones programadas en fechas de cierre se marcan como canceladas

#### 2.4.2 Entidad: Excepciones al Calendario (Anulación de Cierres)

Los instructores tienen la capacidad de **anular un cierre o festivo** para un grupo específico si deciden dar clase.

**Gestión de Excepciones:**
- ID de la excepción
- Instructor que solicita la excepción
- Curso/Grupo afectado
- Fecha que originalmente era festivo/cierre pero se impartirá clase
- Hora de la clase excepcional (puede ser diferente del horario habitual)
- Sala donde se impartirá (puede ser diferente de la sala habitual)
- Motivo de la clase excepcional (ej: recuperación de sesión perdida, preparación de espectáculo)
- Estado de la excepción:
  - Solicitada
  - Aprobada por el administrador (si se requiere aprobación)
  - Confirmada
  - Cancelada

**Notificación a Alumnos:**
Cuando se crea una excepción, el sistema debe:
- Actualizar el calendario del grupo específico
- Notificar a todos los alumnos del grupo (email, WhatsApp) informando que sí habrá clase ese día
- Actualizar el listado de sesiones para el control de asistencia

**Vinculación con otras entidades:**
- Relación con Instructor: profesor que imparte la clase excepcional
- Relación con Curso: grupo al que afecta la excepción
- Relación con Calendario General: fecha que se está anulando como cierre
- Relación con Sala: espacio reservado para la clase excepcional

#### 2.4.3 Entidad: Horarios y Sesiones de Clase

Representa la planificación temporal específica de cada curso.

**Definición de Horario:**
- ID único de horario
- Curso al que pertenece
- Día de la semana (Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo)
- Hora de inicio de la clase
- Hora de finalización de la clase
- Sala donde se imparte
- Instructor que la imparte
- Fecha de inicio de vigencia del horario (desde cuándo aplica)
- Fecha de fin de vigencia (si hay cambios de horario durante el curso)

**Sesiones Individuales (Instancias de Clase):**
A partir de los horarios definidos, el sistema genera automáticamente las sesiones individuales:
- ID único de sesión
- Curso
- Fecha concreta de la sesión
- Hora de inicio y fin
- Sala
- Instructor asignado
- Estado de la sesión:
  - Programada
  - Impartida (clase realizada)
  - Cancelada (por cierre de escuela, ausencia del instructor, etc.)
  - Reprogramada (movida a otra fecha/hora)
- Si fue cancelada: motivo de cancelación
- Si fue reprogramada: nueva fecha/hora

**Generación Automática de Sesiones:**
El sistema debe poder generar automáticamente todas las sesiones del curso académico basándose en:
- Horarios definidos
- Fechas de inicio y fin del curso
- Calendario de cierres y festivos
- Excepciones definidas por instructores

**Vinculación con otras entidades:**
- Relación con Curso: curso al que pertenecen las sesiones
- Relación con Sala: dónde se imparten
- Relación con Instructor: quién las imparte
- Relación con Asistencias: registros de presencia de alumnos en cada sesión

### 2.5 Entidades de Comunicación

#### 2.5.1 Entidad: Mensajería Interna (Alumnos/Instructores)

Sistema de mensajería dentro de la aplicación para facilitar la comunicación directa entre alumnos e instructores.

**Funcionalidad de Mensajería:**
- **Conversaciones 1 a 1**: un alumno puede enviar mensajes privados a su instructor
- **Conversaciones grupales**: el instructor puede enviar mensajes a todos los alumnos de un curso
- **Notificaciones**: los usuarios reciben alertas cuando tienen nuevos mensajes

**Estructura de Mensajes:**
- ID único del mensaje
- Remitente (usuario que envía)
- Destinatario(s) (usuario o grupo que recibe)
- Asunto/Tema del mensaje
- Contenido del mensaje
- Archivos adjuntos (si aplica): fotografías, documentos, vídeos
- Fecha y hora de envío
- Estado de lectura (leído/no leído)

**Casos de Uso:**
- Alumno consulta al instructor sobre dudas de una coreografía
- Alumno notifica al instructor que no podrá asistir a una clase
- Instructor envía recordatorios o materiales de apoyo al grupo
- Instructor comparte enlaces a videos demostrativos

**Privacidad y Moderación:**
- Los mensajes son privados entre las partes involucradas
- El administrador puede tener acceso para moderación en caso de reportes de uso inapropiado

**Vinculación con otras entidades:**
- Relación con Usuario (Estudiante, Instructor): participantes en la conversación
- Relación con Curso: si la conversación está relacionada con un curso específico

#### 2.5.2 Entidad: Comunicaciones Masivas

Sistema para el envío de mensajes masivos a grupos de alumnos o a toda la escuela.

**Tipos de Comunicaciones Masivas:**
- **Resúmenes de clases**: el instructor puede enviar un resumen de lo trabajado en cada sesión
- **Avisos de cierres**: notificaciones sobre días sin actividad
- **Recordatorios de eventos**: información sobre espectáculos, audiciones, competencias
- **Notificaciones de cambios de horario**: si hay modificaciones puntuales
- **Promociones y ofertas**: información sobre nuevos cursos, descuentos, etc.

**Canales de Comunicación:**
La aplicación debe integrarse con sistemas de mensajería empresarial:
- **WhatsApp Business API**: envío de mensajes a través de WhatsApp (requiere consentimiento previo del alumno)
- **Email**: envío de correos electrónicos masivos
- **SMS**: envío de mensajes de texto (opcional)
- **Notificaciones push**: si existe aplicación móvil

**Gestión de Consentimientos:**
El sistema debe verificar que el alumno ha dado su consentimiento para recibir comunicaciones antes de enviarle mensajes por estos canales, cumpliendo con normativa GDPR/LOPD.

**Configuración de Envíos:**
- Selección de destinatarios:
  - Todos los alumnos de la escuela
  - Alumnos de un curso específico
  - Alumnos de un nivel específico
  - Alumnos con una característica específica (ej: con pagos atrasados)
  - Lista personalizada de alumnos
- Programación del envío:
  - Inmediato
  - Programado para fecha/hora específica
- Plantillas de mensajes predefinidas para agilizar el envío

**Integración con Automatizaciones (N8N):**
Los envíos de comunicaciones masivas pueden ser gestionados directamente desde la aplicación o disparados como webhooks hacia N8N, donde se ejecuta el envío a través de los flujos ya configurados.

**Registro de Comunicaciones:**
- Historial de todas las comunicaciones enviadas
- Destinatarios de cada comunicación
- Tasa de entrega (cuántos mensajes fueron entregados exitosamente)
- Tasa de apertura (si aplica, para emails)
- Tasa de clics (si incluye enlaces)

**Vinculación con otras entidades:**
- Relación con Estudiantes: destinatarios de las comunicaciones
- Relación con Cursos: si la comunicación es específica de un curso
- Relación con Calendario: para notificaciones sobre cierres o eventos

### 2.6 Entidades Relacionadas con Contenidos y Marketing

#### 2.6.1 Entidad: Contenidos de Marketing y Redes Sociales

La aplicación incluye funcionalidades para la **generación automática de contenido** destinado a marketing y redes sociales.

**Generación de Textos Promocionales:**
El administrador puede utilizar herramientas integradas de IA para generar automáticamente:
- **Descripciones de programas y cursos**: textos atractivos y completos para publicar en la web y redes sociales
- **Posts para redes sociales**: contenido optimizado para Facebook, Instagram, TikTok, Twitter
- **Copys publicitarios**: textos persuasivos para campañas de marketing
- **Newsletters**: contenido para boletines informativos a alumnos y prospectos
- **Textos para anuncios pagados**: copys para Google Ads, Facebook Ads, etc.

**Proceso de Generación:**
1. El administrador selecciona el tipo de contenido a generar
2. Proporciona información clave (ej: qué curso promocionar, público objetivo, tono deseado)
3. La IA genera varias propuestas de texto
4. El administrador selecciona, edita y aprueba el texto final
5. El contenido puede publicarse directamente o programarse para publicación futura

**Banco de Contenidos Generados:**
- Historial de todos los contenidos generados
- Posibilidad de reutilizar, editar o combinar contenidos anteriores
- Etiquetado y categorización para fácil búsqueda

**Vinculación con otras entidades:**
- Relación con Programas: para generar contenido sobre programas específicos
- Relación con Cursos: para promocionar cursos concretos
- Relación con Eventos: para generar contenido sobre espectáculos o competencias

#### 2.6.2 Entidad: Galerías de Imágenes y Videos de Eventos

Gestión de contenido audiovisual de eventos, competencias, espectáculos y certámenes de la escuela.

**Carga de Contenido:**
El administrador puede:
- Subir colecciones completas de fotografías de un evento
- Subir vídeos de actuaciones, ensayos, competencias
- Organizar el contenido por evento, fecha, curso, alumno

**Metadatos del Contenido:**
- Título del evento
- Fecha del evento
- Tipo de evento (espectáculo, competencia, certamen, ensayo general, clase abierta)
- Alumnos que aparecen en las imágenes/vídeos
- Instructor(es) presente(s)
- Curso(s) que participó(participaron)
- Copyright e información de autoría (fotógrafo, videógrafo)
- Consentimiento de uso de imagen (verificación de que todos los alumnos presentes han autorizado el uso de su imagen)

**Generación Automática de Videos Promocionales:**
Funcionalidad avanzada de IA:
- El administrador selecciona una colección de fotos y/o videos de un evento
- La IA genera automáticamente un **video promocional de alta calidad**:
  - Selecciona los mejores momentos
  - Aplica transiciones y efectos visuales
  - Añade música de fondo (de biblioteca libre de derechos o proporcionada por el administrador)
  - Incorpora textos descriptivos (nombre de la escuela, fecha del evento, hashtags)
  - Genera el video en diferentes formatos para diferentes plataformas (cuadrado para Instagram, horizontal para YouTube, vertical para TikTok/Reels)
- El administrador revisa, edita si es necesario y aprueba el video
- El video final se puede publicar directamente en redes sociales o descargar

**Publicación y Distribución:**
- Visualización en la web corporativa: galería pública de eventos (con contenido aprobado)
- Publicación en redes sociales: integración con APIs de Facebook, Instagram, YouTube
- Envío a alumnos: enlace privado para que descarguen fotos donde aparecen

**Vinculación con otras entidades:**
- Relación con Estudiantes: alumnos que aparecen en el contenido (con verificación de consentimiento)
- Relación con Cursos: cursos que participaron en el evento
- Relación con Instructores: profesores presentes en el evento

### 2.7 Funcionalidades Avanzadas de Inteligencia Artificial

Además del asistente virtual que se detalla en la sección 3.4, se contemplan otras funcionalidades inteligentes de alto valor.

#### 2.7.1 IA para Planificación Anual de Clases (Generación del Cuadrante)

Esta es la **funcionalidad de mayor valor diferencial del proyecto**. Se trata de una capacidad de IA avanzada para automatizar la generación del cuadrante y calendario anual de la escuela, resolviendo uno de los problemas más complejos y que más tiempo consume en la gestión de una escuela de baile.

**Objetivo:**
Generar automáticamente una propuesta de horarios lógica y viable para todo el año académico, considerando todas las restricciones y optimizando el uso de recursos.

**Datos que Cruza la IA:**
La IA debe procesar y considerar simultáneamente:
- **Programas y cursos** ofertados: qué clases deben programarse
- **Niveles de cada curso**: para evitar solapamientos que impidan a alumnos de varios niveles asistir a sus clases
- **Grupos y capacidad**: número de alumnos esperados por curso
- **Horas lectivas** totales necesarias para cada curso en el año
- **Distribución semanal** deseada (ej: 2 clases por semana, 3 clases por semana)
- **Salas disponibles**: capacidad, idoneidad para cada disciplina
- **Restricciones de disponibilidad de los profesores**: días y horarios en que cada instructor está disponible (dato crucial)
  - Disponibilidad general semanal de cada instructor
  - Restricciones específicas (vacaciones personales, compromisos externos)
- **Festivos y cierres**: calendario de días sin actividad
- **Preferencias de los instructores**: horarios preferidos si los han indicado
- **Compatibilidad de cursos**: evitar que cursos que suelen tener alumnos comunes (ej: ballet básico y jazz básico) se solapen en horario
- **Modelos de negocio**: las clases de grupos profesionales preferentemente en horario de mañana, clases regulares en tardes
- **Política de la escuela**: definiciones como "no programar clases los domingos", "las clases infantiles no después de las 20:00", etc.

**Proceso de Generación:**
1. El administrador configura los parámetros de la planificación:
   - Fecha de inicio del curso académico
   - Fecha de finalización del curso académico
   - Cursos a incluir en la planificación
   - Políticas y restricciones generales
2. La IA procesa toda la información de la base de datos
3. Ejecuta algoritmos de optimización (ej: algoritmos genéticos, programación por restricciones, machine learning) para encontrar la mejor distribución
4. Genera una propuesta de cuadrante completo:
   - Horario de cada curso (días de la semana y horas)
   - Sala asignada a cada sesión
   - Instructor asignado a cada curso
   - Calendario completo con todas las sesiones individuales del año
5. El administrador revisa la propuesta:
   - Visualización en formato tabla/calendario
   - Posibilidad de identificar conflictos (si los hay)
   - Métricas de calidad: aprovechamiento de salas, carga de instructores, etc.
6. El administrador puede:
   - Aceptar la propuesta y aplicarla al sistema
   - Solicitar ajustes específicos (ej: "mover curso X al viernes")
   - Regenerar con diferentes parámetros

**Beneficios:**
- **Ahorro de tiempo enorme**: lo que manualmente podría tomar días o semanas, se hace en minutos
- **Optimización de recursos**: máximo aprovechamiento de salas e instructores
- **Viabilidad garantizada**: la IA solo propone horarios que cumplen todas las restricciones
- **Flexibilidad**: fácil regeneración del cuadrante si hay cambios (nuevo instructor, nueva sala, etc.)

**Consideraciones Técnicas:**
Esta funcionalidad requiere:
- Algoritmos complejos de optimización
- Posiblemente uso de modelos de IA/ML entrenados específicamente
- Capacidad de cómputo significativa (puede tardar varios minutos en generar la propuesta)
- Interfaz de usuario intuitiva para configurar parámetros y revisar la propuesta

**Vinculación con otras entidades:**
- Lee de: Cursos, Instructores (y sus restricciones), Salas, Calendario General, Modelos de Negocio
- Escribe en: Horarios, Sesiones

#### 2.7.2 IA para Entrenamiento en Casa (Análisis Postural)

Funcionalidad innovadora que permite a los alumnos entrenar en casa con retroalimentación técnica automatizada.

**Objetivo:**
Ofrecer a los alumnos una herramienta de **entrenamiento personal asistida por IA** que analiza sus movimientos y les proporciona feedback técnico para mejorar su técnica fuera del horario de clases presenciales.

**Funcionamiento:**
1. El alumno accede a la funcionalidad desde su portal privado en la aplicación
2. El alumno graba un vídeo de sí mismo practicando:
   - Puede ser un vídeo de una coreografía completa
   - Puede ser un ejercicio técnico específico (ej: pliés, pirouettes, secuencias de street dance)
   - El vídeo se sube a la aplicación
3. La IA procesa el vídeo:
   - **Detección de pose y seguimiento de movimiento**: identifica las articulaciones clave del cuerpo del alumno (hombros, codos, caderas, rodillas, tobillos, etc.)
   - **Análisis postural**: evalúa la alineación del cuerpo, la colocación de brazos y piernas
   - **Análisis de movimiento**: evalúa fluidez, amplitud, control, equilibrio
   - **Análisis de sincronización**: si hay música de referencia, evalúa si el alumno está en el tempo correcto
   - **Comparación con técnica ideal**: si existe un vídeo de referencia (del instructor o de un bailarín profesional), compara el vídeo del alumno con el modelo ideal
4. La IA genera un **informe de retroalimentación técnica**:
   - Puntos fuertes: aspectos en los que el alumno lo está haciendo bien
   - Áreas de mejora: aspectos técnicos que necesitan trabajo
   - Recomendaciones específicas: ej. "Mantén las rodillas más alineadas con los pies en los pliés", "Extiende más los brazos en la segunda posición", "Trabaja en mantener el equilibrio durante las pirouettes"
   - Calificación o puntuación general (opcional)
   - Marcado temporal en el vídeo: la IA puede señalar momentos específicos del vídeo donde ocurren los errores
5. El alumno visualiza el informe junto con su vídeo:
   - Puede ver su vídeo con anotaciones visuales (ej: líneas que muestran la alineación correcta vs. la suya)
   - Puede reproducir los momentos específicos señalados
6. El alumno puede compartir el análisis con su instructor (opcional):
   - El instructor puede revisar el análisis y añadir comentarios personales adicionales

**Tecnologías Implicadas:**
- **Computer Vision**: para detección y seguimiento de pose humana (librerías como OpenPose, MediaPipe, etc.)
- **Machine Learning**: modelos entrenados para reconocer técnica correcta vs. incorrecta en diferentes estilos de baile
- **Procesamiento de video**: manejo de videos, extracción de frames, generación de anotaciones visuales

**Limitaciones y Consideraciones:**
- La calidad del análisis depende de la calidad del video (iluminación, ángulo, resolución)
- Se requiere que el alumno grabe desde un ángulo apropiado (frontal, lateral o ambos)
- La IA puede dar recomendaciones técnicas generales, pero no sustituye la enseñanza personalizada del instructor
- Es una herramienta de **entrenamiento y mejora**, no de evaluación formal de nivel

**Casos de Uso:**
- Alumno practicando en casa quiere saber si está haciendo correctamente un ejercicio
- Alumno preparándose para una audición o competencia y buscando perfeccionar su técnica
- Alumno que no puede asistir a clase y quiere asegurarse de que está practicando bien en su ausencia

**Vinculación con otras entidades:**
- Relación con Estudiante: propietario del vídeo y del análisis
- Relación con Instructor: puede recibir y comentar los análisis compartidos
- Relación con Curso: el análisis puede estar relacionado con el contenido de un curso específico

---

## 3. Gestión de Usuarios y Sistemas de Autenticación

### 3.1 Sistema de Roles y Permisos

La aplicación implementará una jerarquía de acceso estricta basada en **roles de usuario**, garantizando que cada usuario tenga visibilidad y capacidad de acción únicamente sobre la información y funcionalidades relevantes para su rol.

#### 3.1.1 Rol: Director/Administrador

**Acceso Total:**
El Director o Administrador goza de **acceso completo e irrestricto** a todas las áreas y funcionalidades de la aplicación.

**Funcionalidades Exclusivas:**
- **Configuración general de la escuela**: datos corporativos, logotipo, información de contacto, políticas generales
- **Gestión completa de usuarios**: crear, editar, eliminar cuentas de cualquier tipo de usuario
- **Gestión de Salas**: añadir, modificar, eliminar salas y sus características
- **Gestión de Programas**: definir, editar, eliminar programas curriculares
- **Gestión de Especialidades**: crear y configurar disciplinas de baile
- **Gestión de Niveles**: definir la estructura de niveles de la escuela
- **Gestión de Modelos de Negocio**: configurar los diferentes modelos de servicio
- **Gestión de Tarifas y Precios**: definir y modificar todas las tarifas, descuentos y recargos
- **Gestión de Cursos**: crear, editar, eliminar cursos y actividades
- **Gestión de Instructores**: añadir, editar, eliminar instructores y configurar sus datos, especialidades y disponibilidad
- **Gestión de Estudiantes**: añadir, editar, eliminar estudiantes y gestionar toda su información
- **Gestión de Inscripciones**: aprobar o rechazar solicitudes de inscripción a cursos que requieren selección
- **Gestión de Bajas**: procesar solicitudes de baja de alumnos
- **Gestión Completa de Cobros y Pagos**:
  - Visualizar todos los pagos de todos los alumnos
  - Registrar cobros rápidos (efectivo, BIZUM)
  - Enviar peticiones de pago a alumnos
  - Generar recibos y facturas
  - Ver pagos atrasados de todos los alumnos
  - Generar informes financieros
- **Estadísticas Generales de la Escuela**:
  - Número total de alumnos activos, inactivos, con pagos pendientes
  - Ingresos totales, desglosados por curso, por modelo de negocio, por mes
  - Ocupación de salas
  - Carga de trabajo de instructores
  - Tasa de asistencia general
  - Tendencias de inscripciones y bajas
  - Proyecciones financieras
- **Exportación de Listados**:
  - Exportar listados completos de alumnos (con datos personales, de contacto, estado, cursos, pagos) en formatos Excel, CSV, PDF
  - Filtrar y exportar según diversos criterios (por curso, por estado de pago, por nivel, etc.)
- **Gestión del Calendario General**: definir festivos, cierres de la escuela, períodos vacacionales
- **Aprobación de Excepciones**: aprobar solicitudes de instructores para dar clase en días de cierre
- **Gestión de Comunicaciones Masivas**: enviar mensajes y notificaciones a grupos de alumnos o a toda la escuela
- **Emisión de Documentos**: generar y enviar certificados y diplomas a alumnos
- **Gestión de Contenidos para Web Corporativa**: administrar el CMS que alimenta la web pública
- **Generación de Contenido de Marketing**: usar herramientas de IA para crear textos promocionales
- **Gestión de Galerías de Eventos**: subir y organizar fotos y videos de eventos, generar videos promocionales con IA
- **Utilización de IA para Planificación Anual**: configurar y ejecutar la generación automática del cuadrante de clases
- **Visualización de Horarios**: ver horarios de todos los cursos, filtrados por profesor, sala, día, etc.
- **Acceso a Notas Pedagógicas**: ver las notas que los instructores dejan sobre los alumnos
- **Configuración de Menús y Perfiles de Usuario**: administrar qué opciones del menú están disponibles para cada perfil

#### 3.1.2 Rol: Instructor

**Acceso Limitado a Información Propia:**
Los Instructores tienen un **ámbito de acceso restringido** a:
- **Sus propios alumnos**: solo pueden ver y gestionar información de los alumnos inscritos en los cursos que ellos imparten
- **Sus propios cursos**: solo pueden ver y gestionar los cursos que tienen asignados

**Funcionalidades Permitidas:**
- **Visualización de Datos Propios**:
  - Ver su ficha de instructor (datos personales, especialidades, biografía)
  - Ver sus cursos asignados
  - Ver horarios de sus clases
  - Ver listado de alumnos en cada uno de sus cursos
- **Gestión de Disponibilidad**:
  - Editar su disponibilidad horaria general semanal
  - Registrar restricciones específicas (vacaciones, ausencias)
  - Indicar preferencias horarias
- **Control de Asistencia**:
  - Registrar asistencia de alumnos en sus clases
  - Ver historial de asistencia de sus alumnos
- **Gestión de Excepciones al Calendario**:
  - Solicitar anular un cierre/festivo para dar clase a su grupo
- **Notas Pedagógicas**:
  - Dejar notas sobre el progreso, comportamiento, actitud, áreas de mejora de sus alumnos
  - Transcribir notas de voz (usando IA para transcripción automática)
  - Ver notas anteriores que ha dejado sobre cada alumno
- **Mensajería Interna**:
  - Enviar y recibir mensajes de/a sus alumnos
  - Enviar mensajes grupales a todos los alumnos de un curso
- **Visualización de Horarios**:
  - Ver sus propios horarios de clases
  - Filtrar por sala si imparte en múltiples espacios
- **Emisión de Certificados** (si se le otorga este permiso):
  - Generar certificados de asistencia para sus alumnos
  - Generar diplomas de finalización de curso para sus alumnos
- **Revisión de Análisis de IA de Entrenamiento en Casa**:
  - Ver los análisis generados por la IA sobre videos que sus alumnos han compartido con él
  - Añadir comentarios personales adicionales a los análisis

**Funcionalidades Estrictamente Prohibidas:**
- **No puede exportar listados de alumnos**: por razones de confidencialidad y protección de datos
- **No puede acceder a información financiera**: no puede ver pagos, cuotas, ni estado financiero de alumnos
- **No puede acceder a estadísticas generales de la escuela**: no puede ver información global de inscripciones, ingresos, etc.
- **No puede gestionar alumnos que no estén en sus cursos**: no puede ver datos de alumnos de otros instructores
- **No puede crear, editar o eliminar cursos, programas, salas, tarifas**: no tiene acceso a funciones administrativas globales
- **No puede aprobar/rechazar inscripciones** (a menos que el administrador le delegue esta función específicamente)
- **No puede enviar comunicaciones masivas a toda la escuela**: solo puede comunicarse con sus propios alumnos

#### 3.1.3 Rol: Estudiante/Usuario General

**Acceso Limitado a Información Personal:**
Los Estudiantes tienen acceso únicamente a **su información personal** y a los servicios de la escuela que les conciernen directamente.

**Funcionalidades Permitidas:**
- **Portal Privado Personal**:
  - Ver y editar sus datos personales (dirección, teléfono, email)
  - Ver su fotografía de perfil
  - Actualizar datos de contacto de emergencia
- **Gestión de Inscripciones**:
  - Ver cursos disponibles en la escuela
  - Solicitar inscripción a cursos (directa o con solicitud de aprobación según el curso)
  - Ver estado de sus solicitudes de inscripción (pendiente, aprobada, rechazada)
  - Ver cursos en los que está actualmente inscrito
- **Solicitar Baja**:
  - Enviar solicitud de baja de un curso o de la escuela
  - Indicar motivo de la baja
- **Calendario Personal de Clases**:
  - Ver su calendario personalizado con todas sus clases
  - Ver horarios de cada curso en el que está inscrito
  - Ver sesiones canceladas por cierres de la escuela
  - Ver sesiones excepcionales (clases en festivos que su instructor decidió impartir)
  - Sincronizar con calendarios externos (Google Calendar, Apple Calendar) si la funcionalidad está disponible
- **Estado de Pagos**:
  - Ver todas sus cuotas (pagadas, pendientes, atrasadas)
  - Ver detalle de cada pago (concepto, importe, fecha de vencimiento, fecha de pago, método de pago)
  - Realizar pagos online desde su zona privada (si recibe petición de pago del administrador)
  - Descargar recibos y facturas de sus pagos
- **Gestión de Bonos**:
  - Ver bonos que ha adquirido
  - Ver clases restantes en cada bono
  - Ver historial de uso del bono (cuándo consumió cada clase)
  - Ver fecha de caducidad de sus bonos
  - Comprar nuevos bonos (si la funcionalidad está disponible)
- **Historial de Asistencia**:
  - Ver su porcentaje de asistencia general
  - Ver asistencia específica en cada curso
  - Ver listado de clases a las que asistió y faltó
  - Ver tendencia de asistencia a lo largo del tiempo
- **Mensajería Interna**:
  - Enviar y recibir mensajes de/a sus instructores
  - Ver historial de conversaciones
- **Asistente Virtual (Chatbot)**:
  - Interactuar con el asistente conversacional para hacer consultas administrativas (ej: "¿Cuántas clases me quedan del bono?", "¿Cuándo es mi próxima clase?", "¿Tengo pagos pendientes?")
- **Entrenamiento en Casa con IA**:
  - Subir videos de sí mismo practicando
  - Recibir análisis de postura y movimiento generado por IA
  - Ver recomendaciones técnicas
  - Compartir el análisis con su instructor (opcional)
- **Visualización de Contenidos de la Escuela**:
  - Ver galerías de fotos y videos de eventos en los que participó (con su consentimiento de uso de imagen)
  - Descargar fotos donde aparece

**Funcionalidades Estrictamente Prohibidas:**
- **No puede ver información de otros alumnos**: por protección de datos
- **No puede acceder a información administrativa de la escuela**: cursos internos, gestión de instructores, salas, tarifas globales, etc.
- **No puede modificar sus inscripciones una vez aprobadas** (debe solicitar baja formal)
- **No puede registrar asistencia**: solo los instructores pueden hacerlo

### 3.2 Sistema de Menús, Opciones y Perfiles de Usuario

Además de los roles básicos, la aplicación implementa un **sistema flexible de menús y perfiles** que permite una configuración granular del acceso a funcionalidades.

#### 3.2.1 Catálogo de Menús y Opciones

La aplicación mantiene un **catálogo maestro de menús y opciones** que define todas las funcionalidades disponibles en el sistema.

**Estructura Jerárquica:**
- **Menú**: agrupación de alto nivel (ej: "Gestión de Alumnos", "Gestión de Cursos", "Reportes Financieros")
- **Opción**: funcionalidad específica dentro de un menú (ej: "Crear Alumno", "Editar Alumno", "Exportar Listado de Alumnos")

**Atributos de Cada Opción:**
- Nombre de la opción
- Descripción
- Ruta o enlace dentro de la aplicación
- Icono representativo
- Nivel de acceso requerido (ej: solo administrador, administrador e instructores, todos)

**Gestión del Catálogo:**
Solo el administrador puede:
- Añadir nuevas opciones al catálogo (cuando se desarrollen nuevas funcionalidades)
- Editar opciones existentes
- Desactivar opciones (ocultarlas sin eliminarlas)

#### 3.2.2 Perfiles de Usuario

Los **perfiles de usuario** son conjuntos configurables de menús y opciones que determinan qué puede ver y hacer un usuario en la aplicación.

**Perfiles Por Defecto Vinculados a Roles:**
Cada rol tiene un **perfil por defecto**:
- **Perfil Administrador**: incluye todas las opciones del sistema
- **Perfil Instructor Estándar**: incluye las opciones permitidas para instructores según lo descrito en 3.1.2
- **Perfil Estudiante Estándar**: incluye las opciones permitidas para estudiantes según lo descrito en 3.1.3

**Creación de Perfiles Personalizados:**
El administrador puede crear **perfiles personalizados** para situaciones especiales:
- **Ejemplo 1 - Instructor Senior con Permisos Adicionales**:
  - Incluye todas las opciones del Perfil Instructor Estándar
  - Añade: "Aprobar Inscripciones a Grupos Profesionales" (normalmente reservada para administrador)
  - Añade: "Ver Estadísticas de sus Cursos" (ocupación, tendencia de inscripciones)
- **Ejemplo 2 - Asistente Administrativo**:
  - No es ni administrador completo ni instructor
  - Incluye: "Gestionar Estudiantes" (crear, editar), "Registrar Cobros Rápidos", "Enviar Comunicaciones Masivas"
  - No incluye: "Gestionar Cursos", "Gestionar Instructores", "Ver Estadísticas Financieras Completas"
- **Ejemplo 3 - Recepcionista**:
  - Incluye: "Ver Listado de Alumnos", "Registrar Cobros Rápidos", "Ver Calendario General"
  - No incluye opciones de edición o gestión profunda

**Asignación de Perfiles:**
- Cada usuario tiene un perfil asignado
- **Asignación por Rol (por defecto)**: cuando se crea un usuario de tipo Instructor, se le asigna automáticamente el Perfil Instructor Estándar
- **Asignación Personalizada**: el administrador puede cambiar manualmente el perfil de un usuario específico, asignándole un perfil personalizado diferente al de su rol base

**Configuración de un Perfil:**
Para cada perfil, el administrador define:
- Nombre del perfil
- Descripción
- Lista de menús y opciones incluidas (selección de checkboxes desde el catálogo maestro)

**Visualización Dinámica del Menú:**
Cuando un usuario inicia sesión, la aplicación:
1. Identifica el perfil del usuario
2. Carga las opciones asociadas a ese perfil
3. Construye dinámicamente el menú de navegación mostrando solo las opciones permitidas

De esta forma, dos usuarios con el rol de "Instructor" pero con perfiles diferentes verán menús distintos en la aplicación.

### 3.3 Sistema de Autenticación y Seguridad

#### 3.3.1 Registro e Inicio de Sesión

**Registro de Nuevos Usuarios:**
- **Estudiantes**: pueden autoregistrarse en la aplicación proporcionando sus datos básicos (nombre, email, contraseña)
  - Tras el autoregistro, su cuenta queda en estado "pendiente de verificación"
  - Deben verificar su email haciendo clic en un enlace de confirmación
  - Una vez verificados, pueden acceder a funcionalidades básicas, pero para inscribirse en cursos el administrador puede requerir completar su perfil
- **Instructores y Administradores**: solo pueden ser creados por el administrador
  - El administrador crea la cuenta y define el rol
  - Se envía un email al nuevo usuario con un enlace para establecer su contraseña

**Inicio de Sesión:**
- Autenticación mediante **email y contraseña**
- Opcionalmente: autenticación mediante **Google**, **Facebook** o **Apple** (OAuth)
- Sistema de **recuperación de contraseña** mediante email

**Sesiones y Tokens:**
- Uso de **JWT (JSON Web Tokens)** para gestión de sesiones
- Los tokens tienen una duración limitada (ej: 24 horas) tras la cual el usuario debe volver a iniciar sesión
- Opción de "Recordar sesión" que extiende la duración del token

#### 3.3.2 Seguridad de Datos

**Encriptación:**
- Las contraseñas se almacenan **encriptadas** usando algoritmos fuertes (bcrypt, Argon2)
- Datos sensibles en tránsito se transmiten mediante **HTTPS/TLS**

**Protección contra Ataques:**
- **Protección contra inyección SQL**: uso de consultas parametrizadas y ORM
- **Protección CSRF**: tokens anti-falsificación en formularios
- **Protección XSS**: sanitización de inputs y escape de outputs
- **Limitación de tasa de peticiones**: para prevenir ataques de fuerza bruta o DDoS

**Auditoría:**
- **Logs de acceso**: registro de quién accede a qué información y cuándo
- **Logs de modificaciones**: registro de quién modifica datos críticos (ej: pagos, inscripciones) con marca temporal

#### 3.3.3 Cumplimiento GDPR/LOPD

**Consentimientos:**
Como se mencionó en 2.2.1, el sistema registra el consentimiento explícito para:
- Uso de imágenes
- Recepción de comunicaciones
- Tratamiento de datos personales

**Derechos del Usuario:**
La aplicación debe facilitar el ejercicio de los derechos del usuario:
- **Derecho de Acceso**: el usuario puede descargar toda la información que la escuela tiene sobre él
- **Derecho de Rectificación**: el usuario puede editar sus datos personales
- **Derecho de Supresión**: el usuario puede solicitar la eliminación de su cuenta y sus datos (con ciertas excepciones legales como conservación de datos fiscales)
- **Derecho de Portabilidad**: el usuario puede exportar sus datos en formato estructurado (JSON, CSV)
- **Derecho de Oposición**: el usuario puede retirar su consentimiento para comunicaciones

**Política de Privacidad y Aviso Legal:**
La aplicación debe mostrar claramente:
- Política de privacidad: cómo se recogen, usan, almacenan y protegen los datos
- Aviso legal: información legal de la escuela, condiciones de uso
- Política de cookies: uso de cookies en la aplicación web

---

## 4. Administración de Contenidos (CMS) y Web Corporativa

### 4.1 Doble Propósito de las Entidades

Una característica distintiva de esta aplicación es que actúa como **sistema de gestión de contenidos (CMS)** para alimentar la web corporativa pública de la escuela. Las entidades maestras que se usan internamente para la gestión operativa también sirven como fuente de información para la web pública.

### 4.2 Entidades con Funcionalidad CMS

Las siguientes entidades deben incorporar **campos específicos para la administración de contenidos** destinados a la web corporativa:

#### 4.2.1 Programas

- **Descripción extensa para web**: texto detallado y atractivo que se publicará en la web pública
- **Objetivos de aprendizaje**: lista de competencias que el alumno adquirirá
- **Galería de imágenes**: fotos de alumnos en clases del programa (con consentimiento)
- **Videos promocionales**: videos presentando el programa
- **Testimonios**: opiniones de alumnos que han completado el programa
- **Copyright**: información de autoría de fotos y videos

#### 4.2.2 Instructores

- **Biografía profesional**: texto describiendo la trayectoria, logros y especializaciones del instructor
- **Fotografía profesional**: imagen de alta calidad para la web
- **Curriculum vitae**: formación y experiencia (versión pública)
- **Especialidades**: lista visible de estilos que imparte

#### 4.2.3 Modelos de Negocio

- **Descripción detallada para web**: explicación de en qué consiste cada modelo de negocio, dirigida a potenciales alumnos
- **Imágenes representativas**: fotos de clases de ese modelo

#### 4.2.4 Especialidades

- **Descripción extensa**: historia de la disciplina, características, técnicas
- **Galería de imágenes**: fotos de clases de esa especialidad
- **Videos demostrativos**: clips mostrando movimientos típicos

#### 4.2.5 Tarifas

- **Información pública de precios**: las tarifas se muestran en la web para que los interesados conozcan los costos antes de inscribirse
- **Descripción de qué incluye cada tarifa**

### 4.3 Portal Corporativo Web

El proyecto incluye el desarrollo de un **portal web corporativo público** que muestra la información de la escuela de forma atractiva y profesional.

**Secciones del Portal:**
- **Inicio**: Página principal con información destacada, últimas noticias, próximos eventos
- **Quiénes somos**: Historia de la escuela, misión, visión, valores, equipo directivo
- **Nuestros Programas**: Listado de programas curriculares con descripciones, imágenes, videos
- **Especialidades**: Información detallada de cada estilo de baile ofrecido
- **Instructores**: Perfiles del cuerpo docente con fotos y biografías
- **Tarifas**: Información de precios y opciones de pago
- **Galería**: Fotos y videos de eventos, clases, espectáculos
- **Contacto**: Formulario de contacto, mapa de ubicación, datos de contacto
- **Blog/Noticias** (opcional): Artículos sobre danza, consejos, noticias de la escuela
- **Preguntas Frecuentes (FAQ)**: Respuestas a dudas comunes
- **Aviso Legal y Política de Privacidad**: Información legal obligatoria

**Gestión de Contenidos:**
El administrador, desde la aplicación de gestión interna, puede:
- Editar los textos de cada sección
- Subir/cambiar imágenes y videos
- Publicar/despublicar contenidos (por ejemplo, ocultar temporalmente un programa que no se ofertará el próximo curso)
- Previsualizar la web antes de publicar cambios

**Integración con CMS Propios vs. WordPress:**
- El desarrollo de un CMS propio se prioriza para **cerrar el círculo de la solución** y demostrar capacidad técnica completa
- Se reconoce que en un entorno real, para el contenido catálogo, la integración con **WordPress** (u otro CMS establecido) sería la práctica común por su flexibilidad, ecosistema de plugins y facilidad de uso para clientes no técnicos
- Sin embargo, para este proyecto de hackathon y demostración, el CMS propio aporta valor diferencial y control total sobre la solución

### 4.4 Formulario de Contacto y Captación de Leads

El portal web incluye funcionalidades para **captación de potenciales alumnos**:
- **Formulario de contacto**: Permite a visitantes enviar consultas que llegan al email de la escuela
- **Formulario de preinscripción**: Interesados pueden dejar sus datos para ser contactados
- **Descarga de información**: Posibilidad de descargar un PDF con información completa de la escuela
- **Integración con automatizaciones**: Los datos de leads capturados pueden disparar flujos en N8N para:
  - Enviar email de bienvenida automático
  - Añadir al lead a una lista de email marketing
  - Notificar al administrador de nuevo interesado
  - Programar seguimiento automático (email recordatorio a los X días)

---

## 5. Funcionalidades de Inteligencia Artificial Integradas

Además de la IA para planificación anual (sección 2.7.1) y el análisis postural (sección 2.7.2), la aplicación integra otras funcionalidades inteligentes.

### 5.1 Asistente Virtual Funcional (Chatbot)

La aplicación incluye un **asistente conversacional (chatbot)** integrado en la interfaz, accesible para los alumnos desde su portal privado.

**Objetivo:**
Responder a **preguntas administrativas y funcionales específicas** de forma inmediata, sin necesidad de que el alumno navegue por la aplicación o contacte al administrador.

**Conexión con Datos:**
El chatbot está conectado a:
- **RAG (Retrieval-Augmented Generation)**: tiene acceso a un almacén de conocimientos de la escuela (políticas, normativas, información general)
- **Base de Datos de la Aplicación**: puede consultar datos específicos del alumno en tiempo real

**Tipos de Consultas que Puede Responder:**
- **Sobre bonos**:
  - "¿Cuántas clases me quedan del bono?"
  - "¿Cuándo caduca mi bono?"
- **Sobre horarios**:
  - "¿Cuándo es mi próxima clase?"
  - "¿A qué hora tengo clase de ballet el martes?"
- **Sobre calendario**:
  - "¿Hay clase este viernes?"
  - "¿Cuándo es el próximo festivo sin clase?"
- **Sobre pagos**:
  - "¿Tengo pagos pendientes?"
  - "¿Cuánto debo de la mensualidad de noviembre?"
- **Sobre asistencia**:
  - "¿Cuál es mi porcentaje de asistencia este mes?"
- **Sobre uso de la aplicación**:
  - "¿Cómo puedo ver mis pagos?"
  - "¿Dónde puedo solicitar una baja?"
- **Sobre políticas de la escuela**:
  - "¿Cuál es la política de cancelación de clases?"
  - "¿Hay devolución si me doy de baja a mitad de mes?"

**Funcionamiento:**
1. El alumno escribe su pregunta en lenguaje natural en el chat
2. El chatbot procesa la pregunta mediante NLP (Natural Language Processing)
3. Determina la intención del usuario (qué información busca)
4. Si la pregunta requiere datos específicos del alumno, consulta la base de datos
5. Si la pregunta es general, busca en el RAG de conocimientos
6. Genera una respuesta en lenguaje natural
7. Muestra la respuesta al alumno
8. Opcionalmente, ofrece opciones de seguimiento (ej: "¿Quieres que te muestre cómo ver tu historial de pagos?")

**Escalado a Humano:**
Si el chatbot no puede responder la consulta (es demasiado compleja o ambigua), ofrece:
- "No estoy seguro de entender tu pregunta. ¿Podrías reformularla?"
- "Esta consulta requiere atención personalizada. ¿Quieres que envíe un mensaje al administrador?"
- Botón para contactar directamente con el administrador o instructor vía mensajería interna

**Integración con Automatizaciones:**
El chatbot puede disparar acciones en N8N, como:
- Si el alumno pregunta sobre un pago pendiente y el chatbot identifica que tiene una cuota atrasada, puede ofrecer: "¿Quieres recibir un enlace para pagar ahora?" y disparar el flujo de envío de petición de pago

**Tecnologías:**
- **Modelo de Lenguaje (LLM)**: Claude, GPT-4, o modelo open-source como Llama
- **RAG**: Vector database (Pinecone, Weaviate, ChromaDB) con embeddings de la documentación de la escuela
- **NLP**: Para procesamiento de intenciones y entidades

### 5.2 Transcripción de Notas Pedagógicas por Voz

Los instructores a menudo necesitan dejar notas sobre el progreso de sus alumnos, pero hacerlo por escrito puede ser tedioso y consumir tiempo.

**Funcionalidad:**
- El instructor accede a la ficha de un alumno y selecciona "Dejar nota pedagógica por voz"
- El instructor **graba una nota de voz** (directamente desde la aplicación web o móvil, usando el micrófono del dispositivo)
- La aplicación envía el audio a un servicio de **IA de transcripción** (ej: Whisper de OpenAI, Google Speech-to-Text, Azure Speech)
- La IA transcribe el audio a texto
- El texto transcrito se muestra al instructor para revisión/edición
- El instructor aprueba la transcripción
- La nota se guarda asociada al alumno con fecha, hora y autor (instructor)

**Beneficios:**
- **Ahorro de tiempo**: hablar es más rápido que escribir
- **Mayor detalle**: al ser más fácil, el instructor puede dejar notas más completas
- **Inmediatez**: puede dejar la nota justo después de la clase, cuando la información está fresca

**Casos de Uso:**
- Tras una clase, el instructor graba notas sobre varios alumnos rápidamente: "María ha mejorado mucho su postura en los pliés, pero aún necesita trabajar la extensión de brazos. Recomiendo que practique la segunda posición en casa."

---

## 6. Integración con Sistemas Externos y Webhooks

### 6.1 Integración con la Arquitectura de Automatizaciones (N8N)

Como se estableció en la visión general (sección 1.1), la aplicación **no sustituye las automatizaciones existentes, sino que las orquesta y complementa**.

**Mecanismo de Integración:**
Las acciones realizadas en la aplicación pueden desencadenar **webhooks** que disparan flujos de trabajo en N8N.

**Webhooks Definidos:**

1. **Inscripción Aprobada/Rechazada**:
   - Trigger: El administrador aprueba o rechaza una solicitud de inscripción
   - Acción en N8N: Enviar notificación al alumno por email y/o WhatsApp Business
   - Datos enviados: ID del alumno, curso, estado (aprobado/rechazado), mensaje personalizado

2. **Solicitud de Baja Procesada**:
   - Trigger: Se completa el proceso de baja de un alumno
   - Acción en N8N: Generar certificado de asistencia/finalización, enviarlo por email, actualizar registros externos si los hay

3. **Pago Pendiente**:
   - Trigger: Se crea un pago con fecha de vencimiento próxima o se detecta un pago atrasado
   - Acción en N8N: Enviar recordatorio de pago al alumno, con enlace para pagar online

4. **Emisión de Certificado/Diploma**:
   - Trigger: El administrador emite un documento oficial
   - Acción en N8N: Enviar el documento por email, archivar en Google Drive, registrar en log

5. **Nuevo Lead desde Web**:
   - Trigger: Un visitante completa el formulario de contacto/preinscripción en la web
   - Acción en N8N: Añadir a lista de email marketing, enviar email de bienvenida, notificar al administrador, programar seguimiento

6. **Comunicación Masiva**:
   - Trigger: El administrador solicita enviar un mensaje a un grupo de alumnos
   - Acción en N8N: Ejecutar el envío masivo vía WhatsApp Business, email o SMS según la configuración

7. **Cambio de Estado de Alumno**:
   - Trigger: Un alumno cambia a estado "Con pagos pendientes" o "Inactivo"
   - Acción en N8N: Enviar notificación personalizada, alertar al administrador

**Configuración de Webhooks:**
- La aplicación tiene un módulo de configuración donde el administrador puede:
  - Definir qué eventos disparan webhooks
  - Configurar las URLs de los webhooks de N8N
  - Activar/desactivar webhooks según necesidad
  - Probar el funcionamiento de cada webhook

### 6.2 Integración con WhatsApp Business API

La aplicación debe permitir el envío de mensajes a través de **WhatsApp Business** para comunicaciones con alumnos.

**Funcionalidades:**
- Envío de notificaciones individuales (ej: "Tu solicitud de inscripción ha sido aprobada")
- Envío de comunicaciones masivas (ej: "Recordatorio: mañana no hay clases por festivo")
- Envío de recordatorios de pago
- Envío de confirmaciones de inscripción

**Implementación:**
- La aplicación se conecta a la API de WhatsApp Business (a través de proveedores como Twilio, 360dialog, etc.)
- Alternativamente, la aplicación envía webhooks a N8N, y N8N maneja la comunicación con WhatsApp Business (este segundo enfoque es el preferido para mantener la lógica de envío en las automatizaciones)

**Consideraciones:**
- **Plantillas aprobadas**: WhatsApp Business requiere que los mensajes masivos usen plantillas previamente aprobadas por WhatsApp
- **Consentimiento**: Solo se envían mensajes a alumnos que han dado su consentimiento explícito
- **Ventana de 24 horas**: WhatsApp permite responder a mensajes del usuario dentro de 24 horas; fuera de esa ventana, solo se pueden usar plantillas aprobadas

### 6.3 Integración con Pasarelas de Pago Online

Para permitir que los alumnos paguen sus cuotas online, la aplicación debe integrarse con una **pasarela de pago**.

**Opciones de Pasarelas:**
- **Stripe**: pasarela internacional, fácil integración, ampliamente usada
- **Redsys**: pasarela española, usada por muchos bancos en España
- **PayPal**: opción adicional para flexibilidad

**Flujo de Pago:**
1. El alumno recibe una petición de pago del administrador (por email o WhatsApp) con un enlace
2. El alumno hace clic en el enlace y accede a una página de pago segura en la aplicación
3. El alumno ve el detalle del pago (concepto, importe)
4. El alumno selecciona método de pago (tarjeta de crédito/débito)
5. Introduce los datos de la tarjeta (o usa un método guardado si es cliente recurrente)
6. La aplicación envía la petición de cobro a la pasarela de pago
7. La pasarela procesa el pago y devuelve el resultado (éxito o error)
8. Si el pago es exitoso:
   - La aplicación actualiza el estado del pago a "Pagado" en la base de datos
   - Se genera y envía un recibo al alumno por email
   - Se dispara un webhook a N8N para notificar al administrador (si está configurado)
9. Si el pago falla:
   - La aplicación muestra un mensaje de error al alumno
   - El alumno puede intentar de nuevo con otra tarjeta

**Seguridad:**
- La aplicación **no almacena datos de tarjetas de crédito** (cumple con PCI-DSS)
- Los datos sensibles se manejan directamente por la pasarela de pago
- La aplicación solo recibe tokens o identificadores seguros

### 6.4 Exportación de Datos

**Formatos de Exportación:**
La aplicación permite al administrador exportar listados en varios formatos:
- **Excel (.xlsx)**: Para análisis y procesamiento en hojas de cálculo
- **CSV**: Para importación en otros sistemas o análisis con herramientas de datos
- **PDF**: Para impresión o distribución

**Datos Exportables:**
- Listado completo de alumnos (con filtros por estado, curso, nivel, etc.)
- Listado de instructores
- Listado de cursos con estadísticas (inscripciones, ocupación)
- Informe financiero (ingresos por período, desglosado por curso, modelo de negocio)
- Listado de pagos pendientes
- Historial de asistencia (por alumno, por curso)

**Consideraciones de Privacidad:**
- Solo el administrador puede exportar datos que contengan información personal sensible
- Los instructores no tienen acceso a exportaciones de datos de alumnos (como se estableció en 3.1.2)

---

## 7. Requisitos No Funcionales

### 7.1 Usabilidad

- **Interfaz intuitiva y amigable**: la aplicación debe ser fácil de usar para usuarios no técnicos
- **Diseño responsive**: la aplicación debe funcionar correctamente en dispositivos móviles, tablets y ordenadores de escritorio
- **Accesibilidad**: cumplir con estándares básicos de accesibilidad web (WCAG 2.1 nivel AA) para ser usable por personas con discapacidades
- **Mensajes de error claros**: cuando ocurra un error, el usuario debe recibir un mensaje comprensible que le indique qué salió mal y qué puede hacer

### 7.2 Rendimiento

- **Tiempos de carga**: las páginas deben cargar en menos de 3 segundos en condiciones normales de red
- **Escalabilidad**: el sistema debe soportar al menos 500 usuarios concurrentes (para una escuela con 1000-2000 alumnos)
- **Optimización de consultas**: las consultas a la base de datos deben estar optimizadas con índices apropiados
- **Caché**: uso de estrategias de caché para datos que no cambian frecuentemente (ej: catálogo de cursos, información de programas)

### 7.3 Seguridad

Como se detalló en 3.3.2:
- Encriptación de contraseñas
- Transmisión segura (HTTPS)
- Protección contra ataques comunes (SQL injection, XSS, CSRF)
- Auditoría y logs de acceso

### 7.4 Mantenibilidad

- **Código limpio y bien documentado**: facilitar futuras modificaciones y correcciones
- **Arquitectura modular**: separación clara de responsabilidades (frontend, backend, base de datos)
- **Versionado del código**: uso de Git para control de versiones
- **Pruebas automatizadas**: tests unitarios e integración para funcionalidades críticas

### 7.5 Disponibilidad

- **Uptime objetivo**: 99.5% de disponibilidad (permitiendo ~3.6 horas de inactividad al mes para mantenimiento)
- **Backups automáticos**: copias de seguridad diarias de la base de datos
- **Plan de recuperación**: procedimientos documentados para restaurar el sistema en caso de fallo catastrófico

### 7.6 Cumplimiento Legal

- **GDPR/LOPD**: cumplimiento de normativa de protección de datos
- **LSSI (Ley de Servicios de la Sociedad de la Información)**: inclusión de aviso legal, política de privacidad, política de cookies
- **Gestión de consentimientos**: registro y gestión adecuada de los consentimientos de los usuarios

---

## 8. Consideraciones Finales

### 8.1 Alcance Excluido

Para mantener el proyecto manejable dentro del plazo del hackathon, se excluyen explícitamente del alcance:

- **Gestión completa de facturación contable**: La aplicación registra pagos y genera recibos, pero no se integra con software de contabilidad completo ni genera libros contables
- **Gestión de nóminas de instructores**: No se incluye un módulo de recursos humanos para calcular y gestionar salarios
- **Integración con hardware físico complejo**: Como impresoras de tickets térmicas, datáfonos físicos, torniquetes de acceso
- **Aplicación móvil nativa**: Solo se desarrolla aplicación web responsive, no apps nativas iOS/Android
- **Sistema de reserva de salas** avanzado con disponibilidad en tiempo real para alquiler externo
- **Gestión de inventario** de material (vestuario, zapatillas, equipos de sonido)
- **Sistema de gamificación** (badges, rankings de alumnos)
- **Integración con redes sociales para publicación automática directa** (aunque se genera el contenido, la publicación sería manual o vía herramientas de terceros)

### 8.2 Priorización de Funcionalidades para Desarrollo

Dada la amplitud del alcance, es recomendable una implementación por fases:

**Fase 1 - Núcleo Esencial (MVP):**
- Entidades maestras: Estudiantes, Instructores, Salas, Cursos, Especialidades, Niveles
- Sistema de roles y autenticación básico
- Gestión de inscripciones directas (sin flujo de aprobación aún)
- Control de asistencia básico
- Calendario de clases básico
- Portal web corporativo estático con información de la escuela

**Fase 2 - Gestión Operativa Completa:**
- Modelos de negocio como entidad configurable
- Bonos y gestión de bonos
- Inscripciones con flujo de aprobación
- Gestión de bajas
- Gestión completa de pagos y cobros
- Calendario general con cierres y festivos
- Excepciones al calendario
- Comunicaciones masivas

**Fase 3 - Funcionalidades Avanzadas:**
- Asistente virtual (chatbot)
- Generación de contenido de marketing con IA
- Generación automática de videos promocionales
- CMS completo para web corporativa con gestión dinámica
- Transcripción de notas de voz

**Fase 4 - IA de Alto Valor:**
- IA para planificación anual de clases (generación del cuadrante)
- IA para entrenamiento en casa (análisis postural)

### 8.3 Entregables de Documentación

Para cumplir con la estrategia de documentación profesional definida, se generarán los siguientes documentos:

1. **Análisis Descriptivo Consolidado** (este documento)
2. **Especificación de Requisitos Funcionales** (detalle técnico de cada funcionalidad)
3. **Especificación de Requisitos No Funcionales**
4. **Historias de Usuario** (para cada tipo de usuario y funcionalidad)
5. **Casos de Uso** (diagramas y descripciones de flujos completos)
6. **Diagrama Entidad-Relación** (esquema completo de base de datos)
7. **Diagramas UML**:
   - Diagrama de Casos de Uso
   - Diagramas de Secuencia para flujos clave
8. **Diagramas de Flujo** para procesos operativos
9. **Documento de Arquitectura de Software**
10. **Guía de Estilo y Convenciones de Código**
11. **Plan de Pruebas**
12. **Manual de Usuario** (para cada rol)

### 8.4 Reflexión sobre el Alcance

Este análisis descriptivo ha capturado de forma exhaustiva todas las funcionalidades propuestas por los tres miembros del equipo (Adrián, Javier y Mariano), integrando además ideas y detalles extraídos de las reuniones. El resultado es un documento extremadamente completo que define una solución ambiciosa y de gran valor.

Es importante reconocer que la implementación completa de todas estas funcionalidades en el plazo de un hackathon es altamente desafiante. Sin embargo, la riqueza de este análisis sirve múltiples propósitos:

1. **Demostración de capacidad de análisis**: muestra la capacidad del equipo para realizar un levantamiento completo de requisitos
2. **Base sólida para desarrollo iterativo**: permite seleccionar y priorizar funcionalidades para implementar en fases
3. **Visión de producto a largo plazo**: define el roadmap completo de lo que la aplicación podría llegar a ser
4. **Impresión en la evaluación del hackathon**: un análisis tan exhaustivo y profesional destaca frente a propuestas menos elaboradas
5. **Valor real para el cliente ficticio**: si la solución se llevara a producción, este documento sería la guía definitiva

El equipo debe ahora decidir estratégicamente qué subconjunto de funcionalidades implementar en el tiempo disponible, asegurando que lo desarrollado:
- Sea funcional y esté bien ejecutado (mejor poco y bien hecho que mucho y mal hecho)
- Demuestre integración con las automatizaciones existentes (valor diferencial)
- Incluya al menos una funcionalidad de IA de valor (ej: chatbot o generación de contenido)
- Esté respaldado por documentación técnica impecable

---

## Conclusión

Este análisis descriptivo consolidado presenta una visión completa y detallada de la aplicación web a medida para la escuela de danza Kinesis. Integrando las propuestas de los tres miembros del equipo y la información de las reuniones, se ha definido un sistema robusto, escalable y rico en funcionalidades que abarca desde la gestión operativa básica hasta capacidades avanzadas de inteligencia artificial.

La solución propuesta no solo complementa la arquitectura de automatizaciones previamente desarrollada, sino que cierra el círculo completo de digitalización y profesionalización de la escuela, posicionando a Kinesis como una academia de danza moderna, eficiente y tecnológicamente avanzada.

Con esta base documental sólida, el equipo está preparado para generar un Product Requirements Document (PRD) de altísima calidad que guiará la implementación mediante herramientas de B-coding, maximizando las probabilidades de éxito tanto en el hackathon como en la entrega de valor real al cliente.